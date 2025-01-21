import express from 'express'
import http from 'http'
import { Server } from 'socket.io';
import cors from 'cors'
import mongoose from 'mongoose';
import dotenv from 'dotenv'

import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

// //! routers
import authRoutes from './routes/authRouter.js'
import messageRoutes from './routes/chatRouter.js'
// const chatRouter = require('./routes/chatRouter')
// const homeRouter = require('./routes/homeRouter')
dotenv.config()
const app = express();
const server = http.createServer(app)




// const io = new Server(server, {
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"]
//     }
// })

const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL)
    .then(() => {
        console.log('connected');
    })
    .catch((err) => {
        console.error(err, ' failed to connect');
    })

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser())


app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)



const PORT = process.env.PORT;



// app.use('/auth', authRouter)
// app.use('/chat', chatRouter)
// app.use('/home', homeRouter)



// io.on('connection', (socket) => {
//     console.log(`user connected: ${socket.id}`);
//     socket.on('message', (data) => {
//         console.log(data);

//         io.emit('message', data)
//     })

//     //! disconnect
//     socket.on('disconnect', () => {
//         console.log(`user disconnected: ${socket.id}`);
//     })
// })

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB
})