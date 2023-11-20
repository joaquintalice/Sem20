import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK, UNAUTHORIZED } from '../utils/constants/httpStatusCodes.js';
import { FileModel, PrivateFileModel } from '../models/files.model.js';
import { v2 as cloudinary } from 'cloudinary'

const fileModel = new FileModel();
const privateFileModel = new PrivateFileModel();

export default class FilesController {

    uploadFile = async (req, res) => {
        try {
            console.log(req.user)
            const userId = req.user.id;

            const { filename, path } = req.file
            const insertedFile = await fileModel.insert({ img: filename, url: path, userId: userId });

            if (!insertedFile) {
                return res.status(CONFLICT).json({ message: "Error uploading data" });
            }

            res.status(OK).json({ message: "Archivo subido con éxito", insertedFile });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    }

    uploadPrivateFile = async (req, res) => {
        try {
            console.log(req.user)
            const userId = req.user.id;


            const { filename, path } = req.file

            const insertedFile = await privateFileModel.insert({ img: filename, url: path, userId: userId });

            if (!insertedFile) {
                return res.status(CONFLICT).json({ message: "Error uploading data" });
            }

            res.status(OK).json({ message: "Archivo subido con éxito", insertedFile });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    }

    getPublicFilesPaths = async (req, res) => {
        try {
            const publicFiles = await fileModel.getAll();
            const paths = publicFiles.map(file => file.url);
            res.status(OK).json({ paths });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    };

    getPrivateFilesPaths = async (req, res) => {
        try {
            const privateFiles = await privateFileModel.getAllByUser(req.user.id);
            const paths = privateFiles.map(file => file.url);
            res.status(OK).json({ paths });
        } catch (error) {
            console.error(error);
            res.status(INTERNAL_SERVER_ERROR).json({ error: 'Error interno del servidor.' });
        }
    };
}
