const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



const registerUser = async (req, res) => {

    try{

        const {name, email, password} = req.body;
        if(!name || !email || !password){
            return res.status(400).json({msg: "Please enter all fields"})
        }
        const existingUser = await User.findOne({email: email})
        if(existingUser){
            return res.status(400).json({msg: "User already exists"})
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({name, email, password: hashedPassword});
        res.status(201).json(newUser)


    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }
}

const loginUser = async (req, res) => {

    try{

        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({msg: "Please enter all fields"})
        }
        const existingUser = await User.findOne({email: email})
        if(!existingUser){
            return res.status(400).json({msg: "User does not exist"})
        }
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch){
            return res.status(400).json({msg: "Invalid credentials"})
        }
        const token = jwt.sign({id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: 3600})

        
        res.status(200).json({token, user: {id: existingUser._id, name: existingUser.name, email: existingUser.email}})
    
    }catch(err){
        console.log(err)
        res.status(500).json({msg: "Server error"})
    }

}

module.exports = {registerUser, loginUser}