
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'


import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

//! routers
import authRoutes from './routes/authRouter.js'
import messageRoutes from './routes/chatRouter.js'

import { app, server } from './lib/socket.js';

dotenv.config()



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)



const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
})