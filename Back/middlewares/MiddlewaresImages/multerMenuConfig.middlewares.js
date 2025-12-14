/**
 * @file multerMenuConfig.middlewares.js
 * @module middlewares/MiddlewaresImages/multerMenuConfig
 * @description Middleware de configuración de multer para carga de imágenes de menú.
 */

import multer from "multer";
import path from "path";

/**
 * Configuración de almacenamiento para imágenes de menú (carpeta uploads/menu).
 * @constant
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/menu");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

/**
 * Filtro de archivos para aceptar solo imágenes JPEG, PNG o WEBP.
 * @function fileFilter
 * @param {Request} req - Objeto de solicitud Express
 * @param {Object} file - Archivo recibido
 * @param {Function} cb - Callback de multer
 */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") &&
    (file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/webp")
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "It is not an image file or invalid format (must be JPEG, PNG, or WEBP)"
      ),
      false
    );
  }
};

/**
 * Middleware de multer para carga de imágenes de menú (máx 5MB).
 * @constant
 */
const uploadMenu = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default uploadMenu;
