import React, { useState } from 'react';
import api from '../../api/api';
import { useAuth } from '../../context/AuthContext.jsx';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

const UploadImage = ({ restaurantId, imageId, mode = 'add', onUploadSuccess, onClear, onClose }) => {
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
    const formData = new FormData();

    if (mode === 'add') {
      selectedFiles.forEach((file, idx) => {
        formData.append('images', file);
      });
      try {
        await api.post(`restaurants/${restaurantId}/menu/images`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
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
      } catch (err) {
        setError(err.response?.data?.message || 'Error uploading image. Please try again.');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } finally {
        setUploading(false);
        if (onUploadSuccess) onUploadSuccess();
      }
      return;
    }

    if (mode === 'replace' && imageId) {
      formData.append('image', selectedFiles[0]);
      try {
        await api.patch(
          `restaurants/${restaurantId}/menu/images/${imageId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${user.token}`,
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
      } catch (err) {
        setError(err.response?.data?.message || 'Error uploading image. Please try again.');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } finally {
        setUploading(false);
        if (onUploadSuccess) onUploadSuccess();
      }
      return;
    }

    if (mode === 'postUpload'){
      formData.append('image', selectedFiles[0]);
      formData.append('content', content);
      try {
        await api.post(`/${restaurantId}/posts`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
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
      } catch (err) {
        setError(err.response?.data?.message || 'Error uploading image. Please try again.');
      } finally {
        setUploading(false);
        if (onUploadSuccess) onUploadSuccess();
      }
    }

    if (mode === 'bannerUpload'){
      formData.append('image', selectedFiles[0]);
      try {
        await api.patch(`restaurants/${restaurantId}/images/banner`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${user.token}`,
          }
        });
        setSelectedFiles([]);
        setPopupMessage('Banner image uploaded successfully.');
        setShowPopup(true);
        setTimeout(() => {
          if (onClose) onClose();
          setShowPopup(false);
          setPopupMessage(null);
        }, 3000);
      } catch (err) {
        setError(err.response?.data?.message || 'Error uploading image. Please try again.');
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
        }, 3000);
      } finally {
        setUploading(false);
        if (onUploadSuccess) onUploadSuccess();
      }
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
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