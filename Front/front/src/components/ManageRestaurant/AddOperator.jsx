/**
 * AddOperator Component
 *
 * Permite al propietario de un restaurante agregar un nuevo operador mediante el correo electrónico.
 * Gestiona la validación, feedback de éxito y error, y redirección tras la operación.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante al que se agregará el operador.
 *
 * Estado:
 * - email: Correo electrónico del operador a agregar.
 * - isAdding: Estado de carga durante la operación.
 * - error: Mensaje de error.
 * - successMessage: Mensaje de éxito.
 *
 * Características:
 * - Envía solicitud a la API para agregar operador.
 * - Muestra mensajes de error específicos según la respuesta de la API.
 * - Redirige al usuario tras agregar exitosamente.
 *
 * Ejemplo de uso:
 * <AddOperator restaurantId={restaurantId} />
 *
 * @module AddOperator
 */
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext.jsx';
import { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const AddOperator = ({ restaurantId }) => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleAddOperator = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    setError(null);
    try {
      await api.post(`/restaurants/${restaurantId}/operator`, { email }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSuccessMessage('Operator added successfully.');
      setEmail('');
    } catch (err) {
      if(err.response && err.response.status === 400) {
        setError('This user is already associated with the restaurant.');
      } 
      else if(err.response && err.response.status === 404) {
        setError('This user does not exist.');
      } 
      else if(err.response && err.response.status === 403) {
        setError('Only the owner can add operators.');
      }else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
        setIsAdding(false);
        if (successMessage) {
          setTimeout(() => {
            setSuccessMessage(null);
            navigate('/profile/my-restaurants');
          }, 3000);
        }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 rounded-xl shadow-lg mx-auto max-w-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-[#2DA800] tracking-tight drop-shadow">Add Operator</h2>
      <form onSubmit={handleAddOperator} className="flex flex-col gap-5 w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <label htmlFor="operator-email" className="text-sm font-semibold text-gray-700 mb-1">Operator Email</label>
        <input
          id="operator-email"
          type="email"
          placeholder="Enter operator's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 focus:border-[#2DA800] focus:ring-2 focus:ring-[#2DA800]/30 p-3 rounded-lg transition outline-none text-base"
          autoComplete="off"
          required
        />
        {error && (
          <div className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg animate-pulse">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728" /></svg>
            <span>{error}</span>
          </div>
        )}
        {successMessage && (
          <div className="flex items-center gap-2 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg animate-fade-in">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span>{successMessage}</span>
          </div>
        )}
        <button
          type="submit"
          disabled={isAdding}
          className={`mt-2 py-3 px-6 rounded-lg font-semibold text-lg shadow transition-all duration-200 ${isAdding ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2DA800] hover:bg-[#258A00] text-white'}`}
        >
          {isAdding ? (
            <span className="flex items-center gap-2"><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg> Adding...</span>
          ) : 'Add Operator'}
        </button>
      </form>
    </div>
  );
}

export default AddOperator