import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import useStore from './store/useStore';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Map wrapper that reads URL params and sets store
const MapPage = () => {
  const [searchParams] = useSearchParams();
  const { setSearchQuery, setFilterType } = useStore();

  React.useEffect(() => {
    const search = searchParams.get('search');
    const filter = searchParams.get('filter');
    if (search) setSearchQuery(search);
    if (filter && ['ALL', 'FREE', 'PAID', 'GOVERNMENT'].includes(filter)) {
      setFilterType(filter);
    }
  }, [searchParams, setSearchQuery, setFilterType]);

  return <Home />;
};

const App = () => {
  return (
    <Router>
      <div className="min-h-screen font-sans selection:bg-[#b34b3f] selection:text-white flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
