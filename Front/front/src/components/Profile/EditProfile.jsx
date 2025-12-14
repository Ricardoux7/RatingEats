/**
 * EditProfile Component
 *
 * Permite al usuario editar su perfil (nombre, apellido, usuario, biografía).
 * Obtiene los datos actuales del perfil y permite actualizarlos mediante un formulario.
 *
 * Props:
 * @param {string} id - ID del usuario.
 * @param {Object} user - Objeto de usuario autenticado.
 *
 * Estado:
 * - name, lastName, username, bio: Campos editables del perfil.
 * - originalUser: Datos originales del usuario.
 * - showPopup: Controla la visibilidad del popup.
 * - message: Mensaje de feedback.
 *
 * Características:
 * - Obtiene y muestra los datos actuales del perfil.
 * - Permite editar y guardar los datos del perfil.
 * - Muestra mensajes de éxito o error en popups.
 *
 * Ejemplo de uso:
 * <EditProfile id={user._id} user={user} />
 *
 * @module EditProfile
 */
import api from '../../api/api';
import { useState, useEffect} from 'react';
import '../../components.css';

const EditProfile = ({id, user}) => {
  const [name, setName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [originalUser, setOriginalUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * Efecto que obtiene los datos actuales del perfil del usuario desde la API.
   *
   * @function
   * @returns {void}
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/profile', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOriginalUser(response.data);
        setName(response.data.name || '');
        setLastName(response.data.lastName || '');
        setUsername(response.data.username || '');
        setBio(response.data.biography || '');
      } catch (err) {
      }
    };
    fetchUser();
  }, [id]);

  /**
   * Envía los datos editados del perfil a la API y muestra feedback.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const ShowForm = async () => {
    try {
      const response = await api.patch('/profile', {
        name,
        lastName,
        username,
        biography: bio,
      }, { headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setShowPopup('Profile updated successfully!');
    } catch (err) {
      setShowPopup(err.response?.data?.message || 'Error updating profile. Please try again later.');
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md block md:hidden">
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
        <form onSubmit={(e) => { e.preventDefault(); ShowForm(); }}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] animate-fade-in w-full h-full z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-drop-in w-[90%] inset-0">
            <img src={showPopup === 'Profile updated successfully!' ? '/icons/check.svg' : '/icons/error.svg'} alt="" className='w-15 justify-center mx-auto mb-4'/>
            <h2 className="text-lg font-semibold mb-4 text-center">{showPopup}</h2>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 justify-center mx-auto flex"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
      <div className='hidden md:block  animate__animated animate__fadeIn animate__fast w-[90%] mx-auto mb-5 p-6 bg-white rounded-lg shadow-md'>
        <h2 className="text-2xl font-semibold mb-6">Edit Profile</h2>
        <form onSubmit={(e) => { e.preventDefault(); ShowForm(); }}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
          >
            Save Changes
          </button>
        </form>
        {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] animate-fade-in w-full h-full z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg animate-drop-in w-[90%] inset-0">
            <img src={showPopup === 'Profile updated successfully!' ? '/icons/check.svg' : '/icons/error.svg'} alt="" className='w-15 justify-center mx-auto mb-4'/>
            <h2 className="text-lg font-semibold mb-4 text-center">{showPopup}</h2>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 justify-center mx-auto flex"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  )
}

export default EditProfile;