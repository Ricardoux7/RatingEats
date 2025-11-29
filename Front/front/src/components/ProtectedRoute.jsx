import react from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isLogged, userRole } = useAuth();
  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  const isAuthorized = allowedRoles && allowedRoles.includes(userRole);
  if(!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;