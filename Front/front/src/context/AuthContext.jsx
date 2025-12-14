/**
 * AuthContext y AuthProvider
 *
 * Provee el contexto de autenticación para la aplicación, incluyendo el usuario actual, login, logout y registro.
 * Permite acceder al estado de autenticación y funciones relacionadas desde cualquier componente hijo.
 *
 * Estado:
 * - user: Objeto de usuario autenticado o null.
 * - userRole: Rol del usuario autenticado.
 *
 * Funciones expuestas:
 * - login: Inicia sesión y guarda el usuario en localStorage.
 * - logOut: Cierra sesión y limpia el estado/localStorage.
 * - registerUser: Registra un nuevo usuario.
 *
 * Características:
 * - Persiste el usuario en localStorage.
 * - Redirige tras logout.
 * - Provee el contexto a través de AuthContext.Provider.
 *
 * Ejemplo de uso:
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @module AuthContext
 */
import { createContext, useContext, useState, Children } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (!userInfo || userInfo === 'undefined') return null;
      return JSON.parse(userInfo);
    } catch (e) {
      return null;
    }
  });

    const navigate = useNavigate();

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token, ...userData } = response.data;
            localStorage.setItem('userToken', token);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (error){
            throw error;
        }
    };
    const logOut = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
    };

    const userRole = user?.role || null;  
    const registerUser = async (userCredentials) => {
      try {
        const response = await api.post('/auth/register', userCredentials);
        return response.data;
      } catch (error) {
        throw error; 
    }
  };

  const value = {
    user,
    userRole,
    isLoggedIn: !!user,
    login,
    logOut,
    registerUser, 
  };

    return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 

/**
 * useAuth Hook
 *
 * Hook personalizado para acceder al contexto de autenticación.
 * Permite obtener el usuario, rol y funciones de autenticación desde cualquier componente.
 *
 * @returns {Object} Contexto de autenticación (user, userRole, isLoggedIn, login, logOut, registerUser)
 *
 * Ejemplo de uso:
 * const { user, login, logOut } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);