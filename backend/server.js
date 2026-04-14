
require("dotenv").config()
const app = require("./src/app")
const connectToDatabase = require("./src/config/database")



connectToDatabase()



app.listen(3000, ()=>{

 console.log("server is runnig port 3000 ")
})



 