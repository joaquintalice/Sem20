import UserModel from '../models/user.model.js'
import { BAD_REQUEST, CONFLICT, INTERNAL_SERVER_ERROR, NOT_FOUND } from '../constants/httpStatusCodes.js'

const userModel = new UserModel()

export default class UserController {

    getAll = async (req, res) => {
        try {
            const allUsers = await userModel.getAll();
            if (!allUsers || allUsers.length < 1) res.status(NOT_FOUND).json({ message: "Users not found" });
            res.json(allUsers);
        } catch (error) {
            console.log(error);
            res.status(500).json({ status: req.status, message: "Se rompió el servidor" });
        }
    }

    getById = async (req, res) => {
        try {
            const id = req.params.id;
            if (isNaN(id)) res.status(400).json({ status: req.status, message: `ID is must be a number` });
            const user = await userModel.getById(+id);
            if (!user) res.status(NOT_FOUND).json({ status: req.status, message: "User not found" });
            res.json(user);
        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ mstatus: req.status, essage: "Server error" });
        }
    }

    insert = async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) res.status(BAD_REQUEST).json({ status: req.status, message: "Both email and password are required in body to create new user" });

            const newUser = await userModel.insert({ email, password });
            res.json(newUser);
        } catch (error) {
            console.log(error)
            if (error.code === 'P2002') {
                res.status(CONFLICT).json({ status: req.status, message: "Unique constraint violation" });
            }
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }

    update = async (req, res) => {
        try {
            const id = req.params.id;
            const { email, password } = req.body;

            if (!email || !password) res.status(BAD_REQUEST).json({ status: req.status, message: `Both email and password are required in body to update user with id ${id}` });

            const updatedUser = await userModel.update(+id, body)
            res.json(updatedUser)
        } catch (error) {
            console.log(error)
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }

    remove = async (req, res) => {
        try {
            const id = req.params.id;

            if (isNaN(id)) res.status(400).json({ status: req.status, message: `ID is must be a number` });

            const deletedUser = await userModel.remove(+id)

            res.json(deletedUser)
        } catch (error) {
            console.log(error)
            if (error.code === 'P2025') {
                res.status(NOT_FOUND).json({ status: req.status, message: "Record to delete does not exist." });
            }
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }

}






