const mongoose = require("mongoose")

const blacklistTokenSchema = new mongoose.Schema({

    token :{
        type:String,
        required:[true,"token is required"]
    }

},{

  timestamps:true



})



const blacklisttoken = mongoose.model("blacklisttoken", blacklistTokenSchema)

module.exports = blacklisttoken;