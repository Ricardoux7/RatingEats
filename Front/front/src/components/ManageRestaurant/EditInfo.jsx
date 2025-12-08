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
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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