/**
 * UpdateBanner Component
 *
 * Permite actualizar la imagen de banner de un restaurante.
 * Utiliza el componente UploadImage en modo 'bannerUpload' para gestionar la carga.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante.
 * @param {Function} onClose - Callback para cerrar el modal.
 * @param {Function} onBannerUpdate - Callback tras actualizar el banner.
 *
 * Características:
 * - Renderiza un modal centrado para subir la imagen de banner.
 * - Utiliza UploadImage para la lógica de carga y feedback.
 *
 * Ejemplo de uso:
 * <UpdateBanner restaurantId={id} onClose={closeModal} onBannerUpdate={handleUpdate} />
 *
 * @module UpdateBanner
 */
import { useEffect } from "react";
import UploadImage from "./UploadImage.jsx";

const UpdateBanner = ({ restaurantId, onClose, onBannerUpdate }) => {
  return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.7)] p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl border border-[#258A00] p-6 max-w-md w-full flex flex-col items-center gap-4">
        <UploadImage
          restaurantId={restaurantId}
          mode="bannerUpload"
          onClose={onClose}
          onBannerUpdate={onBannerUpdate}
        />
      </div>
    </div>
  );
}

export default UpdateBanner;