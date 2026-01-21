import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProfileSelection from './pages/ProfileSelection';
import Home from './pages/Home';
import Search from './pages/Search';
import Watch from './pages/Watch';
import useAuthStore from './store/useAuthStore';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) {
    return <Navigate to="/profiles" replace />;
  }
  return children;
};

// Public Route (if already auth, go to home)
const PublicGate = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/profiles" element={
          <PublicGate>
            <ProfileSelection />
          </PublicGate>
        } />

        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/search" element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        } />

        <Route path="/watch/:type/:id" element={
          <ProtectedRoute>
            <Watch />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
