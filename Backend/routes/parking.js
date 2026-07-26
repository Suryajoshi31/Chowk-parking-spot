const express = require('express');

const { z } = require('zod');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Validation schema for creating/updating a parking location
const parkingSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  district: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(['PAID', 'FREE', 'GOVERNMENT']),
  totalSlots: z.number().int().positive(),
  availableSlots: z.number().int().min(0).optional(),
  bikeRate: z.number().nonnegative().nullable().optional(),
  carRate: z.number().nonnegative().nullable().optional(),
  pricePerHour: z.number().nonnegative().optional(),
  vehicleType: z.array(z.enum(['BIKE', 'CAR'])),
  openHours: z.string().optional(),
  contactPhone: z.string().optional(),
  lat: z.number(),
  lng: z.number(),
});

// ────────────────────────────────────────────────────────────
// @route   GET /api/parking
// @desc    Get all parking locations (with optional type filter)
// @access  Public
// ────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { type, district, vehicle } = req.query;
    const where = {};

    if (type && ['PAID', 'FREE', 'GOVERNMENT'].includes(type.toUpperCase())) {
      where.type = type.toUpperCase();
    }
    if (district) {
      where.district = { contains: district, mode: 'insensitive' };
    }
    if (vehicle && ['BIKE', 'CAR'].includes(vehicle.toUpperCase())) {
      where.vehicleType = { has: vehicle.toUpperCase() };
    }

    const locations = await prisma.parkingLocation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   GET /api/parking/stats
// @desc    Get aggregated stats for landing page
// @access  Public
// ────────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const totalLocations = await prisma.parkingLocation.count();
    const totalSlots = await prisma.parkingLocation.aggregate({ _sum: { totalSlots: true } });
    const availableSlots = await prisma.parkingLocation.aggregate({ _sum: { availableSlots: true } });

    const byType = await prisma.parkingLocation.groupBy({
      by: ['type'],
      _count: true,
    });

    const byDistrict = await prisma.parkingLocation.groupBy({
      by: ['district'],
      _count: true,
    });

    res.json({
      totalLocations,
      totalSlots: totalSlots._sum.totalSlots || 0,
      availableSlots: availableSlots._sum.availableSlots || 0,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item._count;
        return acc;
      }, {}),
      byDistrict: byDistrict.reduce((acc, item) => {
        acc[item.district] = item._count;
        return acc;
      }, {}),
      districtsCount: byDistrict.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   GET /api/parking/search?q=thamel
// @desc    Full text search by name/address/district
// @access  Public
// ────────────────────────────────────────────────────────────
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query required' });
    }

    const locations = await prisma.parkingLocation.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } },
          { district: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });

    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   GET /api/parking/nearby?lat=27.7172&lng=85.3240&radius=2
// @desc    Find parking spots within radius (km) using Haversine
// @access  Public
// ────────────────────────────────────────────────────────────
router.get('/nearby', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    const radius = parseFloat(req.query.radius) || 3; // default 3 km

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    // Use raw SQL with Haversine formula for distance calculation
    const locations = await prisma.$queryRaw`
      SELECT *,
        ( 6371 * acos(
            cos(radians(${lat})) * cos(radians(lat)) *
            cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
        )) AS distance
      FROM "ParkingLocation"
      HAVING ( 6371 * acos(
            cos(radians(${lat})) * cos(radians(lat)) *
            cos(radians(lng) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(lat))
      )) < ${radius}
      ORDER BY distance
    `;

    // Convert BigInt and add distance as a number
    const result = locations.map((loc) => ({
      ...loc,
      distance: parseFloat(Number(loc.distance).toFixed(2)),
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   GET /api/parking/:id
// @desc    Get a single parking location by ID
// @access  Public
// ────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const location = await prisma.parkingLocation.findUnique({
      where: { id: req.params.id },
    });

    if (!location) {
      return res.status(404).json({ message: 'Parking location not found' });
    }

    res.json(location);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   POST /api/parking
// @desc    Create a parking location
// @access  Private/Admin
// ────────────────────────────────────────────────────────────
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const validatedData = parkingSchema.parse(req.body);

    const location = await prisma.parkingLocation.create({
      data: validatedData,
    });

    res.status(201).json(location);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   PUT /api/parking/:id
// @desc    Update a parking location
// @access  Private/Admin
// ────────────────────────────────────────────────────────────
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    // We can allow partial updates
    const validatedData = parkingSchema.partial().parse(req.body);

    const location = await prisma.parkingLocation.update({
      where: { id: req.params.id },
      data: validatedData,
    });

    res.json(location);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Parking location not found' });
    }
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   PATCH /api/parking/:id/slots
// @desc    Quick-update available slots (real-time usage)
// @access  Private/Admin
// ────────────────────────────────────────────────────────────
router.patch('/:id/slots', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { availableSlots } = req.body;
    if (typeof availableSlots !== 'number' || availableSlots < 0) {
      return res.status(400).json({ message: 'availableSlots must be a non-negative number' });
    }

    const location = await prisma.parkingLocation.update({
      where: { id: req.params.id },
      data: { availableSlots },
    });

    res.json(location);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Parking location not found' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ────────────────────────────────────────────────────────────
// @route   DELETE /api/parking/:id
// @desc    Delete a parking location
// @access  Private/Admin
// ────────────────────────────────────────────────────────────
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await prisma.parkingLocation.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Parking location removed' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Parking location not found' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
