import express from 'express';
import { 
    getImages, 
    getImageById, 
    saveImage, 
    updateImage, 
    deleteImage 
} from '../controllers/ImageController.js';

const router = express.Router();

router.get('/images', getImages);
router.get('/images/:id', getImageById);
router.post('/images', saveImage);
router.patch('/images/:id', updateImage);
router.delete('/images/:id', deleteImage);

export default router;