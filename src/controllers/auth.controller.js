import AuthModel from '../models/auth.model.js';

import { BAD_REQUEST, CONFLICT, CREATED, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '../utils/constants/httpStatusCodes.js'
import { jwtSecret } from '../utils/constants/jwtSecret.js';
import { validateEmail } from '../utils/email.validation.js';

import * as bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authModel = new AuthModel()

export default class AuthController {



    signup = async (req, res) => {
        const { email, password } = req.body


        if (!email && !password) res.status(BAD_REQUEST).json({ message: "email and password must not be empty" })
        if (!email) res.status(BAD_REQUEST).json({ message: "email must not be empty" })
        if (!password) res.status(BAD_REQUEST).json({ message: "password must not be empty" })
        if (!validateEmail(email)) res.status(BAD_REQUEST).json({ message: "must provide a valid email" })

        const foundUser = await authModel.getByEmail(email)
        if (foundUser) res.status(BAD_REQUEST).json({ message: "Ya existe un usuario registrado con ese email" })

        const hashedPassword = await this.hashPassword(password)

        const newUser = await authModel.insert({ email, password: hashedPassword });
        res.status(OK).json({ message: "Register was successfull", status: CREATED, data: newUser })
    }


    signin = async (req, res) => {
        const { email, password } = req.body;


        if (!email && !password) res.status(BAD_REQUEST).json({ message: "email and password must not be empty" });
        if (!email) res.status(BAD_REQUEST).json({ message: "email must not be empty" });
        if (!password) res.status(BAD_REQUEST).json({ message: "password must not be empty" });
        if (!validateEmail(email)) res.status(BAD_REQUEST).json({ message: "must provide a valid email" });

        const foundUser = await authModel.getByEmail(email);
        if (!foundUser) res.status(BAD_REQUEST).json({ message: "Email o contraseña incorrectos" });
        const isMatch = await this.comparePassword({ password, hash: foundUser.password });
        if (!isMatch) res.status(BAD_REQUEST).json({ message: "Email o contraseña incorrectos" });

        // signJwt token
        const token = await this.signToken({ id: foundUser.id, email: foundUser.email });
        if (!token) res.stats(FORBIDDEN).json({ message: "Error providing access token" });
        res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(OK).json({ message: "Login was success", status: 'magnifike', data: foundUser, token: token });
    }


    singout = async (req, res) => {
        res.clearCookie('jwt');
        return res.status(OK).json({ message: "Logged out successfully" })
    }

    getAll = async (req, res) => {
        try {

            const allUsers = await authModel.getAll();

            if (!allUsers || allUsers.length < 1) res.status(NOT_FOUND).json({ message: "Users not found" });

            res.status(OK).json(allUsers);

        } catch (error) {
            console.log(error);

            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Se rompió el servidor" });

        }
    }

    getById = async (req, res) => {
        try {

            const id = req.params.id;

            if (!this.isUUID(id)) res.status(BAD_REQUEST).json({ status: req.status, message: `ID is must be an UUID` });

            const user = await authModel.getById(id);

            if (!user) res.status(NOT_FOUND).json({ status: req.status, message: "User not found" });

            res.status(OK).json(user);

        } catch (error) {
            console.log(error);
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }



    update = async (req, res) => {
        try {

            const id = req.params.id;

            const { email, password } = req.body;

            if (!email && !password) res.status(BAD_REQUEST).json({ status: req.status, message: `Email or password are required in the body to update user with id ${id}` });

            const hashedPassword = await this.hashPassword(password)

            const updatedUser = await authModel.update(id, { email, password: hashedPassword })

            res.status(OK).json(updatedUser)

        } catch (error) {
            console.log(error)
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }

    remove = async (req, res) => {
        try {

            const id = req.params.id;

            if (!this.isUUID(id)) res.status(BAD_REQUEST).json({ status: req.status, message: `ID is must be an UUID` });

            const deletedUser = await authModel.remove(id)

            res.status(OK).json(deletedUser)

        } catch (error) {
            console.log(error)
            if (error.code === 'P2025') {
                res.status(NOT_FOUND).json({ status: req.status, message: "Record to delete does not exist." });
            }
            res.status(INTERNAL_SERVER_ERROR).json({ status: req.status, message: "Server error" });
        }
    }


    // Helper functions

    async hashPassword(password) {
        const saltOrRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword
    }

    async comparePassword({ password, hash }) {
        return await bcrypt.compare(password, hash)
    }

    async signToken({ id, email }) {
        const payload = { id, email }

        return jwt.sign(payload, jwtSecret)
    }

    isUUID(uuid) {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(uuid);
    }

}






