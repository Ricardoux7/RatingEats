import multer from 'multer';

const multerErrorHandler = (uploadMiddleware) => (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            let message = "Upload failed due to unknown error.";
            let param = "image";
            if (err.code === 'LIMIT_FILE_SIZE'){
                message = "File size is too large. Maximum allowed size is 5MB.";
            }
            if(err.code === 'LIMIT_UNEXPECTED_FILE'){
                message = `Invalid file type. Only JPEG, WEBP and PNG files are allowed. ${err.field}`;
                param = err.field;
            }
            return res.status(400).json({ message: 'validation failed', errors: [{ message, param }] });
        }
        if (err) {
            return next(err); 
        }
        next();
    });
}

export { multerErrorHandler };