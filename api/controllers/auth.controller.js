const User = require("../model/user.model");
const bcrypt = require('bcrypt');

const signup = async (req,res) => {
const {username, email, password} = req.body;
const hashedpassword = bcrypt.hashSync(password, 10);
const newUser = new User({username, email, password: hashedpassword});

try {
    
    await newUser.save();
    res.status(200).json('User created Successfully')
} catch (error) {
    res.status(400).json(error.message)
}


}

module.exports = signup