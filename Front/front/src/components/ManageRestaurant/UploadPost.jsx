/**
 * UploadPost Component
 *
 * Permite a los usuarios subir nuevas imágenes de posts para un restaurante.
 * Utiliza el componente UploadImage en modo 'postUpload' para gestionar la carga de imágenes y contenido asociado.
 *
 * Props:
 * @param {string} restaurantId - ID del restaurante al que se asociarán los posts subidos.
 *
 * Características:
 * - Renderiza un formulario para subir imágenes y contenido de posts.
 * - Utiliza UploadImage para la lógica de carga y validación.
 *
 * Ejemplo de uso:
 * <UploadPost restaurantId={restaurantId} />
 *
 * @module UploadPost
 */
import UploadImage from "./UploadImage.jsx";

const UploadPost = ({ restaurantId }) => {
  return(
    <div className="mt-10 md:mt-0">
      <UploadImage restaurantId={restaurantId} mode="postUpload" />
    </div>
  )
}

export default UploadPost;