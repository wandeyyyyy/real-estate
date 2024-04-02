const User = require("../model/user.model");
const bcrypt = require('bcryptjs');
const errorHandler = require("../utils/error");

const signup = async (req,res, next) => {
const {username, email, password} = req.body;
const hashedpassword = bcrypt.hashSync(password, 10);
const newUser = new User({username, email, password: hashedpassword});

try {
    
    await newUser.save();
    res.status(200).json('User created Successfully');
    res.status(400).json('User already exists')
} catch (error) {
//   next(errorHandler(500, 'error from the function'))
next(error)
}


}

// or use this for more specific error
// const signup = async (req,res) => {
//     const {username, email, password} = req.body;
//     const hashedpassword = bcrypt.hashSync(password, 10);
//     const newUser = new User({username, email, password: hashedpassword});
//     let user = await User.findOne({email:req.body.email});
    
//     if (user) return res.status(400).json('User already registered');
    
        
//         await newUser.save();
//         res.status(200).json('User created Successfully');
    
    
    
    
    
    
//     }

module.exports = signup