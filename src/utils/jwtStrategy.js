import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../utils/constants/httpStatusCodes.js';
import { jwtSecret } from '../utils/constants/jwtSecret.js';

export const authenticateUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(UNAUTHORIZED).json({ error: 'Usuario no autenticado.' });
    }

    try {
        const decodedToken = jwt.verify(token, jwtSecret);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error(error);
        return res.status(UNAUTHORIZED).json({ error: 'Token inválido.' });
    }
};
