import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sem20app',
    },
});

export const multerUpload = multer({ storage });