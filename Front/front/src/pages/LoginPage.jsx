/**
 * LoginPage Component
 *
 * Página de inicio de sesión para usuarios de RatingEats.
 * Permite ingresar credenciales, muestra feedback de carga y errores, y redirige según el rol.
 *
 * Estado:
 * - email, password: Credenciales del usuario.
 * - error: Mensaje de error.
 * - isLoading: Estado de carga.
 *
 * Características:
 * - Permite iniciar sesión y redirige según el rol.
 * - Muestra mensajes de error y feedback de carga.
 *
 * Ejemplo de uso:
 * <LoginPage />
 *
 * @module LoginPage
 */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login, isLoggedIn, userRole } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn) {
            if (userRole === 'owner' || userRole === 'operator') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [isLoggedIn, userRole, navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await login(email, password);
        } catch (error) {
            const message = error.response?.data?.message || 'Error during login. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };
    if (isLoggedIn){
        return (<div className="flex items-center justify-center h-screen bg-gray-50">
            <p className="text-xl text-indigo-600">Logging...</p>
        </div>);
    }
    return (
        <div className="min-h-screen flex  justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <main className='h-full w-full max-w-md '>
                <section className='flex items-center justify-center left-1/2 gap-2'>
                    <div className='bg-[#21C45D] h-20 w-20 rounded-full flex items-center justify-center   position-relative'>
                        <p className='text-white font-bold text-6xl'>R</p>
                    </div>
                    <h1 className='text-[#1D2025] font-bold text-[2.5rem]'>RatingEats</h1>
                </section>
                <p className='text-center text-[#1D2025] text-3xl font-bold mt-10'>Welcome back</p>
                <p className="mt-2 text-center text- text-gray-600">Sign in to continue your culinary journey</p>
                {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
                <form className="bg-white mt-8 space-y-6 flex flex-col border border-gray-300 rounded-lg p-4 position-relative" onSubmit={handleSubmit}>
                    <p className='text-[#1D2025] font-bold text-[1.5rem]'>Sign In</p>
                    <p className='text-[#1D2025]'>Enter your credentials to access your account</p>
                    <div className="rounded-md shadow-sm space-y-3">
                        <p className='font-bold text-[1em] text-[#1D2025]'>Email</p>
                        <input
                        id="email-address"
                        name="email"
                        type="email"
                        required
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        />
                        <p className='font-bold text-[1em] text-[#1D2025]'>Password</p>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-[#21C45D] focus:border-[#21C45D] sm:text-sm h-12"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <button
                        type="submit"
                        className={`group relative h-12 w-full flex justify-center items-center py-2 px-4 border border-transparent text-2xl font-medium rounded-md text-white ${
                            isLoading ? 'bg-[#21C45D] cursor-not-allowed' : 'bg-[#21C45D] hover:bg-[#61ec94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                        }`}
                        disabled={isLoading}
                        >
                        {isLoading ? 'Loading...' : 'Sign in'}
                        </button>
                    </div>
                    <p>Don't have an account? <a href="/register" className='text-[#21C45D]'>Sign up</a></p>
                </form>
            </main>
        </div>
    )
};

export default LoginPage;