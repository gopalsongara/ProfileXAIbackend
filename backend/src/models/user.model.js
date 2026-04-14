const { default: mongoose } = require("mongoose")
const monngoose = require("mongoose")


const userschema = new monngoose.Schema({

  username:{
    type:String,
    required:true,
    unique:[true, "username already exist"]

  },


  email:{
    type:String,
    required:true,
    unique:[true,"email already exist"]

  },

  password: {
    type:String,
    required:true


  }



})


const UserModel = mongoose.model("user", userschema)
  

module.exports = UserModel;