/**
 * ProtectedRoute Component
 *
 * Ruta protegida que restringe el acceso según el rol del usuario y el estado de autenticación.
 * Redirige a login o a la página principal si el usuario no está autorizado.
 *
 * Props:
 * @param {Array<string>} allowedRoles - Lista de roles permitidos para acceder a la ruta.
 *
 * Características:
 * - Verifica autenticación y rol del usuario.
 * - Redirige si no está autorizado.
 * - Renderiza el Outlet si está autorizado.
 *
 * Ejemplo de uso:
 * <ProtectedRoute allowedRoles={["admin", "owner"]} />
 *
 * @module ProtectedRoute
 */
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