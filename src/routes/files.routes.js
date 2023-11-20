import { Router } from "express";
import FilesController from "../controllers/files.controller.js";
import { multerUpload } from "../utils/cloudinary/cloudinary.js";



const router = Router();
const filesController = new FilesController;

router
    .post('/public-file', multerUpload.single('file'), filesController.uploadFile)
    .post('/private-file', multerUpload.single('file'), filesController.uploadPrivateFile)
    .get('/serve-public-files', filesController.getPublicFilesPaths)
    .get('/serve-private-files', filesController.getPrivateFilesPaths)



export default router