/**
 * UploadImage Component
 *
 * Permite subir, reemplazar o actualizar imágenes para menús, posts o banners de un restaurante.
 * Gestiona la validación, feedback visual y lógica de carga según el modo seleccionado.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante.
 * @param {string} [imageId] - ID de la imagen a reemplazar (opcional).
 * @param {string} [mode='add'] - Modo de operación: 'add', 'replace', 'postUpload', 'bannerUpload'.
 * @param {Function} [onUploadSuccess] - Callback tras carga exitosa.
 * @param {Function} [onClear] - Callback para limpiar selección.
 * @param {Function} [onClose] - Callback para cerrar el modal.
 * @param {Function} [onBannerUpdate] - Callback tras actualizar banner.
 *
 * Estado:
 * - selectedFiles: Archivos seleccionados para subir.
 * - showForm: Controla visibilidad del formulario.
 * - content: Contenido del post (modo postUpload).
 * - uploading: Estado de carga.
 * - error: Mensaje de error.
 * - popupMessage: Mensaje de feedback.
 * - showPopup: Controla la visibilidad del popup.
 *
 * Características:
 * - Permite subir, reemplazar o actualizar imágenes según el modo.
 * - Muestra mensajes de éxito o error.
 * - Soporta vista previa de imágenes seleccionadas.
 *
 * Ejemplo de uso:
 * <UploadImage restaurantId={id} mode="add" onUploadSuccess={cb} />
 *
 * @module UploadImage
 */
import React, { useState } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext.jsx';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { put } from "@vercel/blob"

const UploadImage = ({ restaurantId, imageId, mode = 'add', onUploadSuccess, onClear, onClose, onBannerUpdate }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAuth();

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedFiles || selectedFiles.length === 0) {
      setError('Please select at least one image.');
      return;
    }

    setUploading(true);

    try {
      let imageUrls = [];
      if (mode === 'add' || mode === 'replace' || mode === 'bannerUpload') {
        for (const file of selectedFiles) {
          const { url } = await put(`images/${Date.now()}-${file.name}`, file, { access: 'public' });
          imageUrls.push(url);
        }
      }

      if (mode === 'add') {
        // El backend espera { images: [url1, url2, ...] }
        const payload = { images: imageUrls };
        await api.post(`restaurants/${restaurantId}/menu/images`, payload, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        });
        setSelectedFiles([]);
        setPopupMessage('Image uploaded successfully.');
        setShowPopup(true);
        setTimeout(() => {
          if (onClose) onClose();
          setShowPopup(false);
          setPopupMessage(null);
        }, 3000);
      } else if (mode === 'replace' && imageId) {
        // El backend espera { image: url }
        await api.patch(
          `restaurants/${restaurantId}/menu/images/${imageId}`,
          { image: imageUrls[0] },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        setSelectedFiles([]);
        setPopupMessage('Image replaced successfully.');
        setShowPopup(true);
        setTimeout(() => {
          if (onClose) onClose();
          setShowPopup(false);
          setPopupMessage(null);
        }, 3000);
      } else if (mode === 'postUpload') {
        const { url } = await put(`posts/${Date.now()}-${selectedFiles[0].name}`, selectedFiles[0], { access: 'public' });
        await api.post(`/${restaurantId}/posts`, { image: url, content }, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        });
        setSelectedFiles([]);
        setContent('');
        setPopupMessage('Post image uploaded successfully.');
        setShowPopup(true);
        setTimeout(() => {
          if (onClose) onClose();
          setShowPopup(false);
          setPopupMessage(null);
        }, 3000);
      } else if (mode === 'bannerUpload') {
        const { url } = await put(`banners/${Date.now()}-${selectedFiles[0].name}`, selectedFiles[0], { access: 'public' });
        const response = await api.patch(`restaurants/${restaurantId}/images/banner`, { image: url }, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          }
        });
        setSelectedFiles([]);
        setPopupMessage('Banner image uploaded successfully.');
        setShowPopup(true);
        if (onBannerUpdate && response.data?.bannerUrl) {
          onBannerUpdate(response.data.bannerUrl);
        }
        setTimeout(() => {
          if (onClose) onClose();
          setShowPopup(false);
          setPopupMessage(null);
        }, 3000);
      }
    } catch (err) {
      // Mostrar el error real del backend y loguear para depuración
      let backendMsg = err?.response?.data?.message || err?.message || 'Error uploading image. Please try again.';
      setError(backendMsg);
      setShowPopup(true);
      // Log completo para depuración
      if (err?.response) {
        console.error('Upload error:', err.response);
      } else {
        console.error('Upload error:', err);
      }
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } finally {
      setUploading(false);
      if (onUploadSuccess) onUploadSuccess();
    }
    return;
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setError(null);
    setPopupMessage(null);
    if (onClear) onClear();
    if (onClose) onClose();
  };

  return (
    <>
        <div className="bg-white rounded-2xl shadow-md border border-[#258A00] p-6 max-w-md mx-auto flex flex-col items-center gap-4">
          {showPopup && popupMessage && <p className="text-[#258A00] font-semibold">{popupMessage}</p>}
          {error && <p className="text-red-500">{error}</p>}
          <h2 className="text-2xl font-bold text-[#258A00] mb-2">
            {mode === 'replace' ? 'Replace Menu Image' : mode === 'postUpload' ? 'Upload New Post Images' : 'Upload New Menu Images'}
          </h2>
          <form onSubmit={handleUpload} className="w-full flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/jpeg, image/webp"
              multiple={mode !== 'replace' && mode !== 'postUpload' && mode !== 'bannerUpload'}
              onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
              onClick={(e) => e.target.value = null}
              className="border border-gray-300 rounded-lg p-2 w-full"
            />
            {mode === 'postUpload' && (
              <input
                type="text"
                placeholder="Content for the post"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border border-gray-300 rounded-lg p-2 w-full"
              />
            )}
            {selectedFiles.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {selectedFiles.map((file, index) => (
                  <Zoom key={index}>
                    <div className="w-32 h-32 overflow-hidden flex items-center justify-center border border-gray-300 rounded-lg p-2 bg-white">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Image ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </Zoom>
                ))}
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition duration-150 ease-in-out mt-2"
                >
                  Clear
                </button>
              </div>
            )}
            {uploading && <p className="text-[#258A00] font-semibold">Uploading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={uploading}
              className="bg-[#258A00] text-white px-6 py-2 rounded-lg font-bold shadow hover:bg-[#1e6b00] transition"
            >
              {mode === 'replace' ? 'Replace' : 'Upload'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow transition duration-150 ease-in-out mt-2"
            >
              Cancel
            </button>
          </form>
        </div>

    </>
  );
};

export default UploadImage;