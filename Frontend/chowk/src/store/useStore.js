import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Auth
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  // Parking
  parkingLocations: [],
  selectedLocation: null,
  searchQuery: '',
  filterType: 'ALL', // ALL | FREE | PAID | GOVERNMENT
  userLocation: null,  // { lat, lng }

  // Stats (from API)
  stats: null,

  // ── Auth Actions ───────────────────────────────────────────
  login: (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    set({ user: userData, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },

  // ── Parking Actions ────────────────────────────────────────
  setParkingLocations: (locations) => set({ parkingLocations: locations }),

  setSelectedLocation: (location) => set({ selectedLocation: location }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilterType: (type) => set({ filterType: type }),

  setUserLocation: (location) => set({ userLocation: location }),

  setStats: (stats) => set({ stats }),

  // Computed: filtered locations
  getFilteredLocations: () => {
    const { parkingLocations, filterType, searchQuery } = get();
    let filtered = parkingLocations;

    if (filterType !== 'ALL') {
      filtered = filtered.filter((loc) => loc.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q) ||
          loc.district?.toLowerCase().includes(q)
      );
    }

    return filtered;
  },
}));

export default useStore;
