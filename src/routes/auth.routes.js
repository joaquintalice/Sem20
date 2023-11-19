import { Router } from 'express'
import AuthController from '../controllers/auth.controller.js';



const authController = new AuthController()


const router = Router();

router
    .get('/', authController.getAll)

    .get('/signout', authController.singout)

    .get('/:id', authController.getById)

    .post('/signup', authController.signup)

    .post('/signin', authController.signin)


    .patch('/:id', authController.update)

    .delete('/:id', authController.remove)


export default router