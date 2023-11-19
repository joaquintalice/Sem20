import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import { authenticateUser } from './utils/jwtStrategy.js';

import authRoutes from './routes/auth.routes.js';
import fileRoutes from './routes/files.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use('/auth', authRoutes);
app.use('/file', authenticateUser, fileRoutes);


app.listen(PORT, () => {
    console.log(`app, running on port:`, PORT);
})