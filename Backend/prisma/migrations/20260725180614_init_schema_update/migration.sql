-- AlterEnum
ALTER TYPE "ParkingType" ADD VALUE 'GOVERNMENT';

-- AlterTable
ALTER TABLE "ParkingLocation" ADD COLUMN     "bikeRate" DOUBLE PRECISION,
ADD COLUMN     "carRate" DOUBLE PRECISION,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "district" TEXT NOT NULL DEFAULT 'Kathmandu',
ADD COLUMN     "openHours" TEXT;
