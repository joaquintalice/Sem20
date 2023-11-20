import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from '../utils/constants/httpStatusCodes.js';
import multer from "multer";
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url';
import { FileModel, PrivateFileModel } from '../models/files.model.js';


export const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))
const MIME_TYPES = ["image/jpeg", "image/png"]
export const multerUpload = multer({
    storage: multer.diskStorage({
        destination: join(CURRENT_DIR, '../uploads'),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];

            cb(null, `${fileName}-${Date.now()}${fileExtension}`)
        }
    }),
    fileFilter: (req, file, cb) => {
        if (MIME_TYPES.includes(file.mimetype)) cb(null, true)
        else cb(new Error(`Only ${MIME_TYPES.join(' ')} mimetypes are allowed`))
    },
    limits: {
        fieldSize: 10000000
    }
})

const fileModel = new FileModel();
const privateFileModel = new PrivateFileModel();

export default class FilesController {

    uploadFile = async (req, res) => {
        console.log(req.body)
        console.log({ file: req.file })
        const userId = req.user.id;
        const fileName = req.file.filename;
        console.log(fileName)
        console.log(userId)
        const fileUploaded = await fileModel.insert({ img: fileName, userId });
        if (!fileUploaded) res.status(CONFLICT).json({ message: "error uploading data" })
        res.status(OK).json({ message: "Archivo subido con éxito", fileUploaded })
    }

    uploadPrivateFile = async (req, res) => {
        const userId = req.user.id;
        const fileName = req.file.filename;

        const fileUploaded = await privateFileModel.insert({ img: fileName, userId });

        res.status(OK).json({ message: "Archivo subido con éxito", fileUploaded })
    }

    getPublicFilesPaths = async (req, res) => {
        try {
            const publicFiles = await fileModel.getAll();
            const fileNames = publicFiles.map(file => file.img);
            const paths = fileNames.map(fileName => `/uploads/${fileName}`);
            console.log(fileNames)
            res.status(OK).json({ paths });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    };

    getPrivateFilesPaths = async (req, res) => {
        try {

            const privateFiles = await privateFileModel.getAllByUser(req.user.id);
            const fileNames = privateFiles.map(file => file.img);
            const paths = fileNames.map(fileName => `/uploads/${fileName}`);

            res.status(OK).json({ paths });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    };

}

