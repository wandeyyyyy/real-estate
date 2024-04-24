const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
dotenv.config();
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
const listingRouter = require('./routes/list.route')
const path = require('path')


mongoose
.connect('mongodb://127.0.0.1:27017/real-estate')
.then(() => console.log('Connected to MongoDB......'))
.catch(err => console.log('Could not connect to MongoDB.....', err))


const __directoryname = path.resolve();

const app = express();
app.use(cookieParser())
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}
);

app.use('/api/user', userRouter); 
app.use('/api/auth', authRouter);  
app.use('/api/listing', listingRouter);  


app.use(express.static(path.join(__directoryname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__directoryname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})