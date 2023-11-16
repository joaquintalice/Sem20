import { Router } from 'express'
import UserController from '../controllers/user.controller.js'

const userController = new UserController()


const router = Router();

router
    .get('/', userController.getAll)

    .get('/:id', userController.getById)

    .post('/', userController.insert)

    .patch('/:id', userController.update)

    .delete('/:id', userController.remove)


export default router