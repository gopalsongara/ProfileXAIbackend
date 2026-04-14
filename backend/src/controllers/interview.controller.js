const pdfParse = require("pdf-parse")
const  {generateInterviewReport, generateResumepdf}  = require("../services/ai.service")
const interviewReportModel = require("../models/InterviewReport.model")


async function generateInterviewReportController (req, res) {

     const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()


    const {jobdescription, selfdescription} = req.body


 
    const interviewReportgeneratebyai = await generateInterviewReport({
        resume: resumeContent.text,
        jobdescription: jobdescription,
        selfdescription: selfdescription
    })



    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text,
        selfdescription: selfdescription,
        jobdescription: jobdescription,
        ...interviewReportgeneratebyai 
    })



    return res.status(201).json({
        message: "Interview report generated successfully",
        interviewReport
    })
   


}



async function getInterviewReportController (req, res) {
    const {interviewId} = req.params

    if (!interviewId) {
        return res.status(400).json({
            message: "Interview ID is required"
        })
    }

    const interviewReport = await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id

          
    })

     

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found"
        })
    }

    return res.status(200).json({
        message: "Interview report found",
        interviewReport
    })
}


async function getAllInterviewReportsController (req, res) {

    const interviewReports = await interviewReportModel.find({
        user: req.user.id
    }).sort({createdAt: -1}).select("-resume -selfdescription -jobdescription,-__v -behavioralquestions -technicalquestions -skillgaps -preparationplan")

    return res.status(200).json({
        message: "Interview reports found",
        interviewReports
    })


}   


async function generateResumepdfcontroller(req, res) {


      const {interviewId} = req.params

      const resumepdf = await interviewReportModel.findById(interviewId)

      if (!resumepdf) {
        return res.status(404).json({
            message: "Interview report not found"
        })
      }


      const {resume, jobdescription, selfdescription} = resumepdf

    
      const pdfBuffer = await generateResumepdf({
        resume,
        jobdescription,
        selfdescription
      })


        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="resume_${interviewId}.pdf"`,
        });
        res.send(pdfBuffer);

        

  
}






module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllInterviewReportsController,
    generateResumepdfcontroller
    
}

 