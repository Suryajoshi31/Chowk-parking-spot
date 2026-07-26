import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useStore from '../store/useStore';
import { getAllParkingLocations, searchParking } from '../services/api';
import { MapPin, Navigation, Search, Crosshair, Filter, X, Clock, Phone, Bike, Car } from 'lucide-react';

// Fix Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Colored markers for different types
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const icons = {
  PAID: createIcon('orange'),
  FREE: createIcon('green'),
  GOVERNMENT: createIcon('blue'),
};

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Component to fly map to selected location
const FlyToLocation = ({ location }) => {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo([location.lat, location.lng], 16, { duration: 1 });
    }
  }, [location, map]);
  return null;
};

// Component to fly to user location
const FlyToUser = ({ userLoc }) => {
  const map = useMap();
  useEffect(() => {
    if (userLoc) {
      map.flyTo([userLoc.lat, userLoc.lng], 15, { duration: 1 });
    }
  }, [userLoc, map]);
  return null;
};

// Haversine distance (km)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const Home = () => {
  const {
    parkingLocations,
    setParkingLocations,
    selectedLocation,
    setSelectedLocation,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    userLocation,
    setUserLocation,
    getFilteredLocations,
  } = useStore();

  const [loading, setLoading] = useState(true);
  const [flyTarget, setFlyTarget] = useState(null);
  const searchInputRef = useRef(null);

  // Kathmandu center
  const center = [27.7172, 85.3240];

  // Fetch all locations on mount
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getAllParkingLocations();
        setParkingLocations(res.data);
      } catch (err) {
        console.error('Error fetching parking locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [setParkingLocations]);

  // Get user location
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setFlyTarget(loc);
        },
        (err) => console.error('Geolocation error:', err),
        { enableHighAccuracy: true }
      );
    }
  };

  // Search handler
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      const res = await getAllParkingLocations();
      setParkingLocations(res.data);
      return;
    }
    try {
      const res = await searchParking(searchQuery);
      setParkingLocations(res.data);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setFlyTarget({ lat: location.lat, lng: location.lng });
  };

  const filteredLocations = getFilteredLocations();

  const typeColors = {
    FREE: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    PAID: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
    GOVERNMENT: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  };

  return (
    <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <div className="w-full md:w-[400px] bg-white shadow-xl z-10 flex flex-col h-[45%] md:h-full transition-all duration-300">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-slate-100 sticky top-0 bg-white z-20">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2 mb-2 sm:mb-3">
            <MapPin className="text-amber-500" size={20} />
            Parking Spots
          </h2>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-1.5 sm:gap-2 mb-2 sm:mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search area — Thamel, Patan..."
                className="w-full pl-8 sm:pl-9 pr-7 sm:pr-8 py-2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-400 transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    getAllParkingLocations().then((res) => setParkingLocations(res.data));
                  }}
                  className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-[#b34b3f] text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium hover:bg-[#9c3f35] transition-colors"
            >
              <Search size={14} />
            </button>
          </form>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {['ALL', 'FREE', 'PAID', 'GOVERNMENT'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all ${
                  filterType === type
                    ? 'bg-[#121212] text-white'
                    : 'bg-slate-50 border border-slate-200 text-gray-600 hover:border-slate-300'
                }`}
              >
                {type === 'ALL' ? 'All' : type === 'FREE' ? '🟢 Free' : type === 'PAID' ? '🟡 Paid' : '🔵 Govt'}
              </button>
            ))}
            <span className="text-[10px] sm:text-xs text-gray-400 ml-auto">
              {filteredLocations.length} spots
            </span>
          </div>
        </div>

        {/* Location list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>
              ))}
            </div>
          ) : filteredLocations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <MapPin size={40} className="mx-auto mb-3 opacity-50" />
              <p className="font-medium">No parking spots found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            filteredLocations.map((location) => {
              const colors = typeColors[location.type] || typeColors.PAID;
              const dist = userLocation
                ? getDistance(userLocation.lat, userLocation.lng, location.lat, location.lng)
                : null;

              return (
                <div
                  key={location.id}
                  onClick={() => handleSelectLocation(location)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    selectedLocation?.id === location.id
                      ? 'border-amber-500 bg-amber-50 shadow-md transform scale-[1.01]'
                      : 'border-slate-100 bg-white hover:border-amber-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{location.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${colors.bg} ${colors.text} ${colors.border} border shrink-0 ml-2`}>
                      {location.type}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-2 line-clamp-1">{location.address}</p>

                  <div className="flex justify-between items-center text-xs mb-2">
                    <div className="text-slate-600">
                      <span className="font-semibold text-slate-900">{location.availableSlots}</span>
                      <span> / {location.totalSlots} slots</span>
                    </div>
                    {dist !== null && (
                      <span className="text-gray-500 font-medium">{dist.toFixed(1)} km</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {location.vehicleType?.map((type) => (
                        <span key={type} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          {type === 'BIKE' ? <Bike size={10} /> : <Car size={10} />}
                          {type}
                        </span>
                      ))}
                    </div>
                    {location.type === 'PAID' && (
                      <span className="text-xs text-amber-600 font-semibold">
                        Rs.{location.pricePerHour}/hr
                      </span>
                    )}
                    {location.type === 'FREE' && (
                      <span className="text-xs text-green-600 font-medium italic">Free</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Map Area ────────────────────────────────────────── */}
      <div className="flex-1 relative bg-slate-100 h-[55%] md:h-full">
        <MapContainer center={center} zoom={13} className="h-full w-full z-0" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          <FlyToLocation location={flyTarget} />

          {/* User location marker */}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup>
                <div className="p-1 text-center">
                  <p className="font-bold text-sm">📍 You are here</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Parking location markers */}
          {filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[location.lat, location.lng]}
              icon={icons[location.type] || icons.PAID}
              eventHandlers={{
                click: () => handleSelectLocation(location),
              }}
            >
              <Popup className="rounded-xl" maxWidth={280}>
                <div className="p-1">
                  <h4 className="font-bold text-base mb-0.5">{location.name}</h4>
                  <p className="text-xs text-slate-500 mb-1">{location.address}</p>
                  {location.description && (
                    <p className="text-xs text-slate-400 mb-2">{location.description}</p>
                  )}
                  <div className="flex justify-between text-xs mb-2">
                    <span className="font-medium text-amber-600">
                      {location.availableSlots} / {location.totalSlots} slots
                    </span>
                    <span className="font-medium">
                      {location.type === 'PAID'
                        ? `Rs.${location.pricePerHour}/hr`
                        : location.type === 'FREE'
                        ? 'Free'
                        : 'Govt'}
                    </span>
                  </div>
                  {(location.bikeRate != null || location.carRate != null) && location.type === 'PAID' && (
                    <div className="text-xs text-gray-500 mb-2">
                      {location.bikeRate != null && <span>🏍️ Bike: Rs.{location.bikeRate}/hr </span>}
                      {location.carRate != null && <span>🚗 Car: Rs.{location.carRate}/hr</span>}
                    </div>
                  )}
                  {location.openHours && (
                    <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                      <Clock size={10} /> {location.openHours}
                    </p>
                  )}
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#b34b3f] hover:text-[#9c3f35]"
                  >
                    <Navigation size={12} /> Get directions →
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Legend */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md text-xs space-y-1">
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500"></span> Free</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Paid</div>
          <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Government</div>
          {userLocation && (
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500"></span> You</div>
          )}
        </div>

        {/* Locate Me Button */}
        <button
          onClick={locateUser}
          className="absolute bottom-24 right-4 z-[1000] bg-white text-gray-700 p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          title="Find my location"
        >
          <Crosshair size={20} />
        </button>

        {/* Navigate Button */}
        {selectedLocation && (
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${selectedLocation.lat},${selectedLocation.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-4 z-[1000] bg-[#b34b3f] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#9c3f35] transition-colors flex items-center gap-2 font-medium text-sm"
          >
            <Navigation size={18} />
            Navigate to {selectedLocation.name.split(' ')[0]}
          </a>
        )}
      </div>
    </div>
  );
};

export default Home;
