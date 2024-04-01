const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/user.route')
const authRouter = require('./routes/auth.route')
mongoose.connect('mongodb://127.0.0.1:27017/real-estate')
.then(() => console.log('Connected to MongoDB......'))
.catch(err => console.log('Could not connect to MongoDB.....', err))


const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}
);

app.use('/api/user', userRouter); 
app.use('/api/auth', authRouter); 

