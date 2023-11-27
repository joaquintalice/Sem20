import jwt from 'jsonwebtoken';
import { UNAUTHORIZED } from '../utils/constants/httpStatusCodes.js';
import { jwtSecret } from '../utils/constants/jwtSecret.js';

export const authenticateUser = (req, res, next) => {
    const BearerToken = req.headers.authorization;
    const token = BearerToken.split(' ')[1]
    if (!token) {
        return res.status(UNAUTHORIZED).json({ error: 'Usuario no autenticado.' });
    }

    try {
        jwt.verify(token, jwtSecret, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Token no válido o caducado' });
            }

            req.user = user;
            next();
        });
    } catch (error) {
        console.error(error);
        return res.status(UNAUTHORIZED).json({ error: 'Token inválido.' });
    }
};
