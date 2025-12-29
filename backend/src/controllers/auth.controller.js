import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.js';

export const signup = async (req, res) => {
   try {
        const {fullName, email, password} = req.body;
        
        // Validation
        if(!fullName || !email || !password) {
            return res.status(400).json({message: "All fields are required"})
        }
        
        if(password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters long"})
        }

        // Check if email is valid : regex 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({message: "Invalid email format"});
        }
        
        // Check if user already exists
        const user = await User.findOne({email});
        if(user) {  
            return res.status(400).json({message: "Email is already registered"});
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });
    

           if(newUser)  { 
        //persist user first then issue auth cookie 
        const savedUser = await newUser.save();
        generateToken(savedUser._id, res); 
        
        res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });

        //todo : send welcome email 
    }
        
    } catch (error) {
        console.log("Error in signup controller", error);
        res.status(500).json({message: "Internal Server Error"});
    }
};