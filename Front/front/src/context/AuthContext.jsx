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

export const useAuth = () => useContext(AuthContext);