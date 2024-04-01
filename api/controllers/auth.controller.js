const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const errorHandler = require("../utils/error");

const signup = async (req,res, next) => {
const {username, email, password} = req.body;
const hashedpassword = bcrypt.hashSync(password, 10);
const newUser = new User({username, email, password: hashedpassword});

try {
    
    await newUser.save();
    res.status(200).json('User created Successfully')
} catch (error) {
//   next(errorHandler(500, 'error from the function'))
next(error)
}


}

module.exports = signup