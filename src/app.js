import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import usersRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3005

app.use(cors());
app.use(express.json());


app.use('/api', usersRoutes);


app.listen(PORT, () => {
    console.log(`app, running on port:`, PORT)
})