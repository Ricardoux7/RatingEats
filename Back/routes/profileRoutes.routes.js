import express from 'express';
import { protect } from '../middlewares/authMiddleware.middlewares.js';
const router = express.Router();
router.get('/', protect, (req, res) => {
    res.json({ 
        msg: 'Acceso exitoso a la ruta privada',
        user: req.user
    });
});

export default router;