const jwt = require("jsonwebtoken")
const blacklisttoken = require("../models/blacklist.model")


async function protected(req, res, next){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"token not provided"
        })
    }


  const isTokenBlacklisted = await blacklisttoken.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:"token is invalied"
        })
    }



  



  try  {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)



    //after the verify token all token  data save in req.user 
    req.user = decoded;
    next();

}
  catch (error) {
   return res.status(401).json({
    message:"invalid token"
   })
  }


}

module.exports = {
    protected

}