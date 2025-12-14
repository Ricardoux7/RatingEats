/**
 * ManageMenu Component
 *
 * Permite gestionar las imágenes del menú de un restaurante (agregar, reemplazar, eliminar).
 * Muestra las imágenes actuales y permite su administración visualmente.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante.
 *
 * Estado:
 * - menuItems: Lista de ítems del menú.
 * - isLoading: Estado de carga.
 * - error: Mensaje de error.
 * - replaceImageId: ID de la imagen a reemplazar.
 * - popupMessage: Mensaje de feedback.
 * - showPopup: Controla la visibilidad del popup.
 *
 * Características:
 * - Permite agregar, reemplazar y eliminar imágenes del menú.
 * - Muestra mensajes de éxito o error.
 *
 * Ejemplo de uso:
 * <ManageMenu restaurantId={restaurantId} />
 *
 * @module ManageMenu
 */
import api from "../../api/api";
import { useState, useEffect } from "react";
import '../../components.css';
import Zoom from 'react-medium-image-zoom'
import UploadImage from "./UploadImage.jsx";

const ManageMenu = ({ restaurantId }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [replaceImageId, setReplaceImageId] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await api.get(`/restaurants/${restaurantId}/menu/images`);
        setMenuItems(response.data.menu || response.data);
      } catch (err) {
        setError('Failed to fetch menu items.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenuItems();
  }, [restaurantId]);

  const deleteMenuImage = async (imageId) => {
    try {
      await api.delete(`/restaurants/${restaurantId}/menu/images/${imageId}`);
      setMenuItems(menuItems.filter(item => item._id !== imageId));
      setPopupMessage('Menu item deleted successfully.');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage(null);
      }, 3000);
    } catch (err) {
      setError('Failed to delete menu item.');
      setPopupMessage('Error deleting menu item.');
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        setPopupMessage(null);
      }, 3000);
    }
  }

  return (
    <div className="p-5 max-w-7xl mx-auto">
      {showPopup && popupMessage && (
        <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 ${popupMessage.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white px-6 py-3 rounded-lg shadow-lg z-50`}>
          <p>{popupMessage}</p>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-4 text-[#258A00]">Manage Menu Images</h2>
      {isLoading ? (
        <p>Loading menu items...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-gray-100 p-2 relative shadow-md rounded-lg h-auto flex flex-col items-center"
            >
              <div className="absolute top-6 right-2 text-white flex flex-col gap-2 z-20">
                <button
                  onClick={() => deleteMenuImage(item._id)}
                  className="bg-red-500 px-2 py-1 rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setReplaceImageId(item._id)}
                  className="bg-blue-500 px-2 py-1 rounded-md hover:bg-blue-600 transition"
                >
                  Replace
                </button>
              </div>
              {replaceImageId === item._id && (
                <div className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center p-4 z-30">
                  <div className="w-full max-w-xs">
                    <UploadImage
                      restaurantId={restaurantId}
                      imageId={replaceImageId}
                      mode="replace"
                      onUploadSuccess={() => {
                        setReplaceImageId(null);
                        api.get(`/restaurants/${restaurantId}/menu/images`).then(response => {
                          setMenuItems(response.data.menu || response.data);
                        });
                      }}
                      onClear={() => setReplaceImageId(null)}
                    />
                  </div>
                </div>
              )}
              <Zoom>
                <img
                  src={`${BACKEND_URL}${item.url}`}
                  alt={item.name}
                  className="w-full h-48 md:h-56 lg:h-64 xl:h-72 object-cover rounded-md"
                />
              </Zoom>
            </div>
          ))}
        </div>
      )}
      <div className="mt-10 max-w-lg mx-auto">
        <UploadImage
          restaurantId={restaurantId}
          mode="add"
          onUploadSuccess={() =>
            api.get(`/restaurants/${restaurantId}/menu/images`).then(response =>
              setMenuItems(response.data.menu || response.data)
            )
          }
        />
      </div>
    </div>
  );
};

export default ManageMenu;