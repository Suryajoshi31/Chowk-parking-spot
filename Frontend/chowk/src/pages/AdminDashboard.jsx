import React, { useEffect, useState } from 'react';
import { 
  getAllParkingLocations, 
  deleteParkingLocation, 
  createParkingLocation,
  updateParkingSlots
} from '../services/api';
import useStore from '../store/useStore';
import Button from '../Components/ui/Button';
import Input from '../Components/ui/Input';
import { Plus, Edit2, Trash2, X, RefreshCw } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useStore();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    district: 'Kathmandu',
    type: 'PAID',
    totalSlots: 0,
    pricePerHour: 0,
    vehicleType: ['BIKE', 'CAR'],
    lat: 27.7172,
    lng: 85.3240,
  });

  const fetchLocations = async () => {
    setLoading(true);
    try {
      const res = await getAllParkingLocations();
      setLocations(res.data);
    } catch (error) {
      console.error('Error fetching parking locations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteParkingLocation(id);
        fetchLocations();
      } catch (error) {
        console.error('Failed to delete', error);
        alert('Failed to delete location');
      }
    }
  };

  const handleUpdateSlots = async (id, newAvailable) => {
    try {
      await updateParkingSlots(id, parseInt(newAvailable));
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert('Failed to update slots');
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      // Prepare data (convert strings to numbers where needed)
      const submitData = {
        ...formData,
        totalSlots: parseInt(formData.totalSlots),
        availableSlots: parseInt(formData.totalSlots), // start fully empty
        pricePerHour: formData.type === 'FREE' || formData.type === 'GOVERNMENT' ? 0 : parseFloat(formData.pricePerHour),
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
      };

      await createParkingLocation(submitData);
      setIsModalOpen(false);
      fetchLocations();
      // Reset form
      setFormData({
        name: '', address: '', district: 'Kathmandu', type: 'PAID',
        totalSlots: 0, pricePerHour: 0, vehicleType: ['BIKE', 'CAR'],
        lat: 27.7172, lng: 85.3240
      });
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || 'Failed to create location');
    }
  };

  // Stats
  const totalSpots = locations.length;
  const totalSlots = locations.reduce((sum, loc) => sum + loc.totalSlots, 0);
  const freeSpots = locations.filter(l => l.type === 'FREE').length;
  const govtSpots = locations.filter(l => l.type === 'GOVERNMENT').length;

  return (
    <div className="pt-24 min-h-screen max-w-7xl mx-auto px-4 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage parking locations across the valley (Logged in as {user?.email})</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchLocations} className="flex items-center gap-2">
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} /> Refresh
          </Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} /> Add Location
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm font-semibold text-slate-500 mb-1">Total Locations</div>
          <div className="text-3xl font-bold text-slate-900">{totalSpots}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm font-semibold text-slate-500 mb-1">Total Capacity</div>
          <div className="text-3xl font-bold text-slate-900">{totalSlots} <span className="text-sm text-slate-400 font-normal">slots</span></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-sm font-semibold text-slate-500 mb-1">Free / Govt Locations</div>
          <div className="text-3xl font-bold text-slate-900">{freeSpots} <span className="text-lg text-slate-400">/</span> {govtSpots}</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Name & Location</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Status (Free/Total)</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Price</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    <RefreshCw className="animate-spin mx-auto mb-2" size={24} />
                    Loading locations...
                  </td>
                </tr>
              ) : locations.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No parking locations found. Click "Add Location" to create one.
                  </td>
                </tr>
              ) : (
                locations.map((loc) => (
                  <tr key={loc.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{loc.name}</div>
                      <div className="text-xs text-slate-500">{loc.address} ({loc.district})</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide ${
                        loc.type === 'FREE' ? 'bg-green-100 text-green-700' : 
                        loc.type === 'GOVERNMENT' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {loc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{loc.availableSlots}</span>
                        <span className="text-slate-400">/ {loc.totalSlots}</span>
                        {/* Quick slots update for simulation */}
                        <div className="flex gap-1 ml-2">
                          <button 
                            onClick={() => handleUpdateSlots(loc.id, Math.max(0, loc.availableSlots - 1))}
                            className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold"
                            title="Car parked (-1 free slot)"
                          >-</button>
                          <button 
                            onClick={() => handleUpdateSlots(loc.id, Math.min(loc.totalSlots, loc.availableSlots + 1))}
                            className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center hover:bg-slate-200 text-slate-600 font-bold"
                            title="Car left (+1 free slot)"
                          >+</button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {loc.type === 'PAID' ? `Rs.${loc.pricePerHour}/hr` : <span className="italic text-slate-400">Free</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleDelete(loc.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete location"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative my-8">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-3xl z-10">
              <h2 className="text-xl font-bold">Add New Parking Location</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              {formError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Input 
                  label="Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Thamel Square Parking"
                  required
                />
                
                <Input 
                  label="Address" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="e.g. Thamel Marg"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    District
                  </label>
                  <select 
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
                  >
                    <option value="Kathmandu">Kathmandu</option>
                    <option value="Lalitpur">Lalitpur</option>
                    <option value="Bhaktapur">Bhaktapur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Type
                  </label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 bg-white"
                  >
                    <option value="PAID">Paid</option>
                    <option value="FREE">Free</option>
                    <option value="GOVERNMENT">Government</option>
                  </select>
                </div>

                <Input 
                  label="Total Capacity (Slots)" 
                  type="number"
                  min="1"
                  value={formData.totalSlots}
                  onChange={(e) => setFormData({...formData, totalSlots: e.target.value})}
                  required
                />

                {formData.type === 'PAID' && (
                  <Input 
                    label="Price Per Hour (Rs)" 
                    type="number"
                    min="0"
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: e.target.value})}
                    required
                  />
                )}
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <h3 className="text-sm font-semibold mb-4">Map Coordinates</h3>
                <div className="grid grid-cols-2 gap-5">
                  <Input 
                    label="Latitude" 
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    required
                  />
                  <Input 
                    label="Longitude" 
                    type="number"
                    step="any"
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    required
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Find coordinates by right-clicking on Google Maps. Default is Kathmandu center.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Location
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
