const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const blacklisttoken = require('../models/blacklist.model')




async function registerUser(req, res){


 const {email, username, password} = req.body;

 if(!email || !username || !password){
    return res.status(400).json({
        message:"please provide full information"
    })
 }

 let existUser = await UserModel.findOne({
    $or: [{email},{username}]
 })

 if(existUser){
    return res.status(400).json({
        message:"User already exist with this email or username"
    })
 }

 const hashedPassword = await bcrypt.hash(password, 10);

 const user = await UserModel.create({
    email,
    username,
    password: hashedPassword
 })

 const token = jwt.sign(
   { id: user._id, username: user.username },
   process.env.SECRET_KEY,
   { expiresIn: "1d" }
 )

 res.cookie("token", token)

 return res.status(201).json({
   message: "User registered successfully",
   user:{
      id: user._id,
      username: user.username,
      email: user.email
   }
 })

}


async function loginUser(req, res){
   
   const {email, password} = req.body;
   
console.log(email, password)

   const user = await UserModel.findOne({email})
   
   if(!user){
    
      return res.status(200).json({
         message:"user not found"

      })
   }

      const isvalidPassword = await bcrypt.compare(password, user.password)

      if(!isvalidPassword){
         return res.status(400).json({
            message:"invalid email or password"
         })
      }


      const token = jwt.sign({
         id: user._id,
         username: user.username
      }, process.env.SECRET_KEY, {
         expiresIn: "1d"
      })

      res.cookie("token", token)

      return res.status(200).json({
         message:"user logged in successfully",
         user:{
            id: user._id,
            username: user.username,
            email: user.email
         }

      })

   

}


async function logoutUser(req, res) {

   const token = req.cookies.token;

   if (token) {
      await blacklisttoken.create({ token });
   }

   res.clearCookie("token");

   return res.status(200).json({
      message: "User logged out successfully"
   });
}

async function  getMeController(req, res){


   const user = await UserModel.findById(req.user.id)

   return res.status(200).json({
      message:"user found",
      user : {
         id: user._id,
         username: user.username,
         email: user.email
      }
      
   })

}





module.exports = { registerUser,
   loginUser,
   logoutUser,
   getMeController
   

   

 }