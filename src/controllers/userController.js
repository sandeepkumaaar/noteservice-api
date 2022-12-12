const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const signup = async (req, res)=>{

    const {username, email, password} = req.body;

    try {

        //check existing user
        const existingUser = await userModel.findOne({email: email});
        if(existingUser){
            res.status(400).json({message: "User already exists"});
        }

        //creat hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //create new user
        const result = await userModel.create({
            email: email,
            password: hashPassword,
            username: username
        });

        //generate token
        const token = jwt.sign({email: result.email, id: result._id}, SECRET_KEY);
        res.status(201).json({user: result, token: token}); 
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});   
    }

}

const signin = async (req, res)=>{

    const {email, password} = req.body;

    try {
        
        //check existing user
        const existingUser = await userModel.findOne({email: email});
        if(!existingUser){
            res.status(404).json({message: "User not fount"});
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        if(!matchPassword){
            return res.status(400).json({message: "Invalid Credentials."})
        }

         //generate token
         const token = jwt.sign({email: existingUser.email, id: existingUser._id}, SECRET_KEY);
         res.status(200).json({user: existingUser, token: token}); 



    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"});   
    }

    
}

module.exports = {signin, signup};