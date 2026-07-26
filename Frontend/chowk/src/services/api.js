import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Parking ─────────────────────────────────────────────────

export const getAllParkingLocations = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type) params.append('type', filters.type);
  if (filters.district) params.append('district', filters.district);
  if (filters.vehicle) params.append('vehicle', filters.vehicle);
  return api.get(`/parking?${params.toString()}`);
};

export const searchParking = (query) =>
  api.get(`/parking/search?q=${encodeURIComponent(query)}`);

export const getNearbyParking = (lat, lng, radius = 3) =>
  api.get(`/parking/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);

export const getParkingStats = () =>
  api.get('/parking/stats');

export const getParkingById = (id) =>
  api.get(`/parking/${id}`);

export const createParkingLocation = (data) =>
  api.post('/parking', data);

export const updateParkingLocation = (id, data) =>
  api.put(`/parking/${id}`, data);

export const updateParkingSlots = (id, availableSlots) =>
  api.patch(`/parking/${id}/slots`, { availableSlots });

export const deleteParkingLocation = (id) =>
  api.delete(`/parking/${id}`);

// ── Auth ────────────────────────────────────────────────────

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password });

export const registerUser = (email, password) =>
  api.post('/auth/register', { email, password });

// ── Health ──────────────────────────────────────────────────

export const checkHealth = () =>
  api.get('/health');

export default api;
