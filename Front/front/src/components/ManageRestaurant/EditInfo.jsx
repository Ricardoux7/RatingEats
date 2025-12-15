/**
 * EditInfo Component
 *
 * Permite editar la información básica de un restaurante (nombre, descripción, dirección, categorías, horario, capacidad, teléfono).
 * Gestiona la validación, feedback visual y actualización de datos.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante a editar.
 * @param {Function} onUpdate - Callback para actualizar la información tras editar.
 * @param {Object} initialData - Datos iniciales del restaurante.
 *
 * Estado:
 * - form: Objeto con los campos editables.
 * - loading: Estado de carga.
 * - success: Mensaje de éxito.
 * - error: Mensaje de error.
 *
 * Características:
 * - Permite editar y guardar información del restaurante.
 * - Muestra mensajes de éxito o error.
 *
 * Ejemplo de uso:
 * <EditInfo restaurantId={id} onUpdate={handleUpdate} initialData={data} />
 *
 * @module EditInfo
 */
import { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext.jsx';

const EditInfo = ({ restaurantId, onUpdate, initialData }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    description: '',
    adress: '',
    categories: '',
    schedule: '',
    capacity: '',
    phoneNumber: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [geoLocations, setGeoLocations] = useState(
    initialData?.geoLocation && Array.isArray(initialData.geoLocation)
      ? (Array.isArray(initialData.geoLocation[0])
          ? initialData.geoLocation.map(pair => pair.join(', '))
          : [initialData.geoLocation.join(', ')])
      : ['']
  );

  useEffect(() => {
    if (initialData && typeof initialData === 'object') {
      setForm({
        name: initialData.name || '',
        description: initialData.description || '',
        adress: initialData.adress || '',
        categories: Array.isArray(initialData.categories) ? initialData.categories.join(', ') : (initialData.categories || ''),
        schedule: initialData.schedule || '',
        capacity: initialData.capacity || '',
        phoneNumber: initialData.phoneNumber || '',
      });
      setGeoLocations(
        initialData.geoLocation && Array.isArray(initialData.geoLocation)
          ? (Array.isArray(initialData.geoLocation[0])
              ? initialData.geoLocation.map(pair => pair.join(', '))
              : [initialData.geoLocation.join(', ')])
          : ['']
      );
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGeoLocationChange = (idx, value) => {
    setGeoLocations(geoLocations.map((g, i) => (i === idx ? value : g)));
  };

  const handleAddGeoLocation = () => {
    setGeoLocations([...geoLocations, '']);
  };

  const handleRemoveGeoLocation = (idx) => {
    setGeoLocations(geoLocations.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        ...form,
        categories: form.categories.split(',').map(c => c.trim()),
        geoLocation: geoLocations
          .filter(g => g.trim() !== '')
          .map(g => g.split(',').map(c => Number(c.trim()))),
      };
      const response = await api.patch(
        `/restaurants/${restaurantId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setSuccess(response.data.message || 'Information updated successfully!');
      if (onUpdate) onUpdate(response.data);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map(e => e.message).join('\n'));
      } else {
        setError(data?.message || 'Error updating information. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-2">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-[#2DA800]"
      >
        <h2 className="text-2xl font-bold mb-6 text-[#2DA800] text-center">Edit Restaurant Information</h2>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Adress</label>
          <input
            type="text"
            name="adress"
            value={form.adress}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Categories (separated by comma)</label>
          <input
            type="text"
            name="categories"
            value={form.categories}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Schedule</label>
          <textarea
            name="schedule"
            value={form.schedule}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold text-[#2DA800]">GeoLocation (Lat, Lon por sucursal)</label>
          {geoLocations.map((value, idx) => (
            <div key={idx} className="flex items-center mb-2 space-x-2">
              <input
                type="text"
                name={`geoLocation-${idx}`}
                value={value}
                onChange={e => handleGeoLocationChange(idx, e.target.value)}
                className="w-full border border-[#2DA800] rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2DA800]"
                placeholder="Ejemplo: 10.123, -64.123"
                required
              />
              {geoLocations.length > 1 && (
                <button type="button" onClick={() => handleRemoveGeoLocation(idx)} className="text-red-500 font-bold px-2">Remove</button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddGeoLocation} className="text-[#2DA800] font-bold mt-2">+ Add Branch</button>
        </div>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <button
          type="submit"
          className="w-full bg-[#2DA800] hover:bg-[#279700] text-white font-semibold px-4 py-2 rounded transition duration-200"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default EditInfo;