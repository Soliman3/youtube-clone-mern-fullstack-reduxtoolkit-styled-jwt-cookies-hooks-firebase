import User from "../models/User.js";
// to encrypt password in database and decoding it while checking...
import bcrypt from 'bcryptjs';
// importing json web token to receive jwt in response...
import jwt from 'jsonwebtoken';
import { createError } from "../error.js";



// Create new user...
export const signup = async (req, res, next) => {
    try {
        // encrypting password...
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        // adding newUser with hashed password in User model...
        const newUser = new User({...req.body, password: hash});
         await newUser.save();
        // response message in success...
        res.status(200).send('New user created..');
   } catch (error) {
        next(error);
   }
}

// Sign in process and responding by cookie...
export const signin = async (req, res, next) => {
    try {
        // check for username in mongo db...
        const user = await User.findOne({ name: req.body.name })
        // if not found user send this message with status 404...
        if (!user) return next(createError(404, "user not found in db"))
        // decoding password and check it...
        const isCorrect = await bcrypt.compare(req.body.password, user.password)
        // if password mismatched then send this message with status 400 ...
        if (!isCorrect) return next(createError(400, "wrong password"))
        // intialize user token throw user id and send jwt...
        const token = jwt.sign({ id: user._id }, process.env.JWT)
        // exclude password from response in cookie...
        const { password, ...other } = user._doc
        // response by user data without password...
         res.cookie("access_token", token, { httpOnly: true }).status(200).json(other);
         
        
        
   } catch (error) {
        next(error);
   }
}

// Google...
export const googleAuth = async (req, res, next) => {
     try {
          const user = await User.findOne({ email: req.body.email });
          if (user) {
               const token = jwt.sign({ id: user._id }, process.env.JWT)
               res.cookie("access_token", token, { httpOnly: true }).status(200).json(user._doc);
          } else {
               const newUser = new User({ ...req.body, fromGoogle: true })
               const savedUser = await newUser.save();

               const token = jwt.sign({ id: savedUser._id }, process.env.JWT)
               res.cookie("access_token", token, { httpOnly: true }).status(200).json(savedUser._doc);
          }
     } catch (error) {
          next(error);
     }
}