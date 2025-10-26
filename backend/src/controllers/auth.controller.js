
import e from 'express';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import {generateToken} from "../lib/utils.js";



export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;

    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }       
        if(password.length < 6){  
            return res.status(400).json({message:"Password must be at least 6 characters"});
        }   
        const w=emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"});
        }   
             const   user = await User.findOne({email});
        if(user){
            return res.status(400).json({message:"User already exists"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname: fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            const savedUser = await newUser.save();
            generateToken(res, savedUser._id);

             res.status(201).json({_id: newUser._id, fullname: newUser.fullname, email: newUser.email, profilePic: newUser.profilePic});
        }else{
            return res.status(400).json({message:"Invalid user data"});
        }
    } catch (error) {
        console.log("ERROR IN SIGNUP CONTROLLER:", error);
        return res.status(500).json({message:" Internal server error"});
    }
}

  