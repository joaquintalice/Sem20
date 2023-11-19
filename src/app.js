import express from 'express'

import cookie from 'cookie'
import cors from 'cors'
import jwt from "jsonwebtoken"

import dotenv from 'dotenv'

import authRoutes from './routes/auth.routes.js'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005

app.use(cors());
app.use(express.json());
app.use(cookieParser())



const test = (req, res, next) => {
    try {
        // Obtener el token desde las cookies
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies.token;

        if (!token) {
            throw new Error('Token no encontrado en las cookies');
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        console.log(decoded);
        next();
    } catch (error) {
        res.status(401).json({ message: "Usuario no autorizado" });
    }
};

app.use('/auth', authRoutes);



app.listen(PORT, () => {
    console.log(`app, running on port:`, PORT)
})