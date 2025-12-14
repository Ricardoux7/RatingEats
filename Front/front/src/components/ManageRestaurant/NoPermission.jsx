/**
 * NoPermission Component
 *
 * Muestra un mensaje de advertencia cuando el usuario no tiene permisos para acceder a una página o funcionalidad.
 *
 * Características:
 * - Mensaje visual claro de falta de permisos.
 * - Diseño centrado y responsivo.
 *
 * Ejemplo de uso:
 * <NoPermission />
 *
 * @module NoPermission
 */
const NoPermission = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <h1 className="text-3xl font-bold text-red-600 mb-4">You don't have permission</h1>
    <p className="text-lg text-gray-700">You don't have permission to access this page.</p>
  </div>
);

export default NoPermission;