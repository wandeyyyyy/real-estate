const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const errorHandler = require("../utils/error");
const jwt = require('jsonwebtoken');


const signup = async (req,res, next) => {
    
try {
const {username, email, password} = req.body;
const validUser = await User.findOne({email})
if (validUser) return next(errorHandler(404, 'User Already Exists'))
const hashedpassword =  await bcrypt.hash(password, 10);
const newUser = new User({username, email, password: hashedpassword});


    await newUser.save();
    res.status(201).json('User Created Successfully')
} catch (error) {
    next(error)

}
    // Save the new user


};

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


const signin = async (req,res, next) => {
    const { email, password} = req.body;
 
    
    try {
        //check if email exists 
        const validUser = await User.findOne({email})
        if (!validUser) return next(errorHandler(404, 'User not Found'))
        // check if passord is correct
        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401 , 'Incorrect Credentials!'))
        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET );
    // dont send the password back to client 
    const { password: pass, ...rest} = validUser._doc;


    res.cookie('access_token', token, {httpOnly: true }).status(200).json(rest)

    } catch (error) {
    //   next(errorHandler(500, 'error from the function'))
    next(error)
    }
    
    
    }

module.exports = {
                  signin, 
                  signup}