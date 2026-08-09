const express = require("express")

const router = express.Router()
const authenticate = require("../middlewares/auth.middleware")
const interviewController = require("../controllers/interview.controller")
const upload = require("../middlewares/file.middleware")
const interviewLimiter = require("../middlewares/handleratelimiting.middleware")









router.post("/", authenticate.protected, upload.single("resume"),  interviewController.generateInterviewReportController)



router.get("/report/:interviewId", authenticate.protected, interviewController.getInterviewReportController)

router.get("/report", authenticate.protected, interviewController.getAllInterviewReportsController)

router.post("/resume/pdf/:interviewId", authenticate.protected, interviewController.generateResumepdfcontroller)

router.delete("/delete/:interviewId", authenticate.protected, interviewController.deleteInterview)



module.exports = router;







