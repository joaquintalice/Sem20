import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sem20app',
    },
});

export const multerUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {

        console.log(file)

        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten archivos de imagen'), false);
        }

        cb(null, true);
    },
    limits: {
        fileSize: 6 * 1024 * 1024, // 6 MB
    },
});