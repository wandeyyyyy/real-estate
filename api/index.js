const express = require('express');
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/real-estate')
.then(() => console.log('Connected to MongoDB......'))
.catch(err => console.log('Could not connect to MongoDB.....', err))


const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000')
}
);


