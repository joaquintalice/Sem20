import express from 'express';

import cors from 'cors';

import dotenv from 'dotenv';

import cookieParser from 'cookie-parser';
import { authenticateUser } from './utils/jwtStrategy.js';

import authRoutes from './routes/auth.routes.js';
import fileRoutes from './routes/files.routes.js';
import { dirname, join } from 'path'
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url))

app.use('/uploads', express.static(join(CURRENT_DIR, './uploads')));
app.use('/auth', authRoutes);
app.use('/file', authenticateUser, fileRoutes);


app.listen(PORT, () => {
    console.log(`app, running on port:`, PORT);
})