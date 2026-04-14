const mongoose = require("mongoose")




const technicalQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "tecnical question is required"]
    },

    intention: {
        type: String,
        required: [true, "intention is required"]

    },

    answer: {
        type: String,
        required: [true, "answer is required"]
    },

},
    {
        _id: false

    })



const behavioralQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "behavioral question is required"]
    },

    intention: {
        type: String,
        required: [true, "intention is required"]

    },

    answer: {
        type: String,
        required: [true, "answer is required"]
    },

},
    {
        _id: false

    })



const skillgapschema = new mongoose.Schema({

    skill: {
        type: String,
        required: [true, "skill is required"]
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "severity is required"]
    },


},
    {
        _id: false

    })

const preparationschema = new mongoose.Schema({

    day: {
        type: Number,
        required: [true, "day is required"]
    },

    tasks: {

        type: [String],
        required: [true, "tasks are required"]
    },

    focus: {
        type: String,
        required: [true, "focus is required"]
    }


},
    {
        _id: false

    })





const InterviewReportSchema = new mongoose.Schema({

    jobdescription: {
        type: String,
        required: true
    },

    resume: {
        type: String,
    },
    selfdescription: {
        type: String,
    },

    matchscore: {
        type: Number,
        min: 0,
        max: 100
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },


    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillgaps: [skillgapschema],
    preparationplan: [preparationschema],

    title: {
        type: String,
        required: true
    }

   

},
    {

        timestamps: true
    }

)



const InterviewReportModel = mongoose.model("interviewreport", InterviewReportSchema)

module.exports = InterviewReportModel;