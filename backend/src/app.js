const express = require('express');
const app = express();
const authRouter = require('../src/routes/auth.route');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const interviewRouter = require("./routes/interview.route")




app.use(cookieParser());
app.use(express.json())


app.use(cors({
    origin: "https://profilexai.netlify.app/",
    credentials: true
}))

app.use("/api/interview", interviewRouter)

app.use("/api/auth", authRouter)

module.exports = app;
