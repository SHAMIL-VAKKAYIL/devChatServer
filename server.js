const express = require('express');
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config()

//! routers
const authRouter = require('./routes/authRouter')
const chatRouter = require('./routes/chatRouter')
const homeRouter = require('./routes/homeRouter')

const app = express();
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

const mongoURL = process.env.MONGO_URL

mongoose.connect(mongoURL)
    .then(() => {
        console.log('connected');
    })
    .catch((err) => {
        console.error(err, ' failed to connect');
    })

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 3000;



app.use('/auth', authRouter)
app.use('/chat', chatRouter)
app.use('/home', homeRouter)



io.on('connection', (socket) => {
    console.log(`user connected: ${socket.id}`);
    socket.on('message', (data) => {
        console.log(data);

        io.emit('message', data)
    })

    //! disconnect
    socket.on('disconnect', () => {
        console.log(`user disconnected: ${socket.id}`);
    })
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})