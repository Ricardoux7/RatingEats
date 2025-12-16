/**
 * RegisterPage Component
 *
 * Página de registro de nuevos usuarios para RatingEats.
 * Permite ingresar datos personales, muestra feedback de carga y errores.
 *
 * Estado:
 * - name, lastName, username, email, password: Campos del formulario.
 * - error: Mensaje de error general.
 * - fieldErrors: Errores específicos de campos.
 * - isLoading: Estado de carga.
 *
 * Características:
 * - Permite registrar un nuevo usuario.
 * - Muestra mensajes de error y feedback de carga.
 *
 * Ejemplo de uso:
 * <RegisterPage />
 *
 * @module RegisterPage
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const { registerUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
  }, [isLoggedIn, navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);
  setFieldErrors({});
  let newFieldErrors = {};
  try {
    await registerUser({ name, lastName, username, email, password });
    navigate('/login', { replace: true });
  } catch (error) {
    const errors = error.response?.data?.errors || [error.message];
    errors.forEach((errorMessage) => {
      const lowerCaseMessage = errorMessage.toLowerCase();
      if (lowerCaseMessage.includes('username')) {
        newFieldErrors.username = errorMessage;
      } else if (lowerCaseMessage.includes('last name')) {
        newFieldErrors.lastName = errorMessage;
      } else if (lowerCaseMessage.includes('name')) {
        newFieldErrors.name = errorMessage;
      }
      if (lowerCaseMessage.includes('email')) {
        newFieldErrors.email = errorMessage;
      }
      if (lowerCaseMessage.includes('password')) {
        newFieldErrors.password = errorMessage;
      }
    });
    setFieldErrors(newFieldErrors);
    } finally {
      setIsLoading(false);
    }
};
  return (
  <div className="min-h-screen flex  justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <main className='h-full w-full max-w-md '>
              <section className='flex items-center justify-center left-1/2 gap-2'>
                  <div className='bg-[#21C45D] h-20 w-20 rounded-full flex items-center justify-center   position-relative'>
                      <p className='text-white font-bold text-6xl'>R</p>
                  </div>
                  <h1 className='text-[#1D2025] font-bold text-[2.5rem]'>RatingEats</h1>
              </section>
              <form className="bg-white mt-8 space-y-3 flex flex-col border border-[#E2E8F0] rounded-lg p-6 mx-auto position-relative" onSubmit={handleSubmit}>
                  <p className='text-[#1D2025] font-bold text-[1.5rem]'>Sign Up</p>
                  <p className='text-[#1D2025]'>Enter your details to create an account</p>
                  <div className="rounded-md shadow-sm space-y-3">
                    <label htmlFor="name" className='font-bold text-[1em] text-[#1D2025]'>Name</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${fieldErrors.name ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12`}
                      placeholder="John"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isLoading}
                    />
                    {fieldErrors.name && <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>}
                    <label htmlFor="lastName" className='font-bold text-[1em] text-[#1D2025]'>Last Name</label>
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12`}
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      />
                    {fieldErrors.lastName && <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>}
                    <label htmlFor="username" className='font-bold text-[1em] text-[#1D2025]'>Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${fieldErrors.username ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12`}
                      placeholder="Nombre de usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                    {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
                    <label htmlFor="email" className='font-bold text-[1em] text-[#1D2025]'>Email</label>
                    <input
                      id="example@gmail.com"
                      name="email"
                      type="email"
                      required
                      className={`appearance-none relative block w-full px-3 py-2 border ${fieldErrors.email ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12`}
                      placeholder="Correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                      />
                    {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
                    <label htmlFor="password" className='font-bold text-[1em] text-[#1D2025]'>Password</label>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className={`appearance-none relative block w-full px-3 py-2 border ${fieldErrors.password ? 'border-red-500' : 'border-gray-300'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12`}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        />
                    {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
                  </div>
              <div>
                <button
                  type="submit"
                  className={`group relative h-12 w-full flex justify-center items-center py-2 px-4 border border-transparent text-2xl font-medium rounded-md text-white ${
                  isLoading ? 'bg-[#21C45D] cursor-not-allowed' : 'bg-[#21C45D] hover:bg-[#61ec94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  }`}
                  disabled={isLoading}
                  >
                  {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
              </div>
            <p>Already have an account? <a href="/login" className='text-[#21C45D]'>Log in</a></p>
          </form>
      </main>
    </div>
  )
};

export default RegisterPage;