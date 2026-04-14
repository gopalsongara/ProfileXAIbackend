const { OpenAI } = require("openai");
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema");

const puppeteer = require("puppeteer")



const ai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});



const interviewReportSchema = z.object({
    matchscore: z.number().describe("the match score between the candidate and the job description based on the resume and self description provided by the candidate"),
    technicalQuestions: z.array(z.object({
        question: z.string().describe("the technical question asked in the interview"),
        intention: z.string().describe("the intention of the interviewer behind asking this question"),
        answer: z.string().describe("how to answer this question what points to cover and what approach to follow etc."),
    })).describe("behavioral questions that can be asked in the interview along with their intention and answer them."),


    behavioralQuestions: z.array(z.object({
        question: z.string().describe("the behavioral question asked in the interview"),
        intention: z.string().describe("the intention of the interviewer behind asking this question"),
        answer: z.string().describe("how to answer this question what points to cover and what approach to follow etc."),
    })).describe("behavioral questions that can be asked in the interview along with their intention and answer them."),

    skillgaps: z.array(z.object({
        skill: z.string().describe("the skill that the candidate is lacking and needs to work on to be a better fit for the job"),
        severity: z.enum(["low", "medium", "high"]).describe("the severity of the skill gap whether it is low medium or high")
    })).describe("the skill gaps that the candidate has with respect to the job description and resume and self description provided by the candidate along with their severity whether low medium or high"),




    preparationplan: z.array(z.object({
        day: z.number().describe("the day of the preparation plan like day 1 day 2 etc."),
        tasks: z.array(z.string()).describe("the tasks that the candidate should do on that day to prepare for the interview"),
        focus: z.string().describe("the focus of the preparation for that day like whether to focus on technical questions behavioral questions or skill gaps etc.")

    })).describe("the preparation plan for the candidate to prepare for the interview day by day with tasks and focus for each day"),

    title: z.string().describe("the title of the interview report which can be the job title or the role the candidate is applying for")



})




async function generateInterviewReport({ resume, jobdescription, selfdescription }) {

    const prompt = `Generate an interview report for a candidate with the following details:
        Resume: ${resume}
        Selfdescription: ${selfdescription}
        Jobdescription: ${jobdescription}


       You are an expert technical interviewer and career coach.

Analyze the following:
- Job Description
- Candidate Resume
- Candidate Self Description

Your task is to generate a structured Interview Report in STRICT JSON format.

IMPORTANT RULES:
- Output ONLY valid JSON (no explanation, no text outside JSON)
- Follow the exact structure given below
- Do not add extra fields
- Keep answers clear, practical, and beginner-friendly

JSON FORMAT:

{
  "title": "string",

  "matchscore": number,

  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],

  "skillgaps": [
    {
      "skill": "string",
      "severity": "low | medium | high"
    }
  ],

  "preparationplan": [
    {
      "day": number,
      "tasks": ["string"],
      "focus": "string"
    }
  ]
}

GUIDELINES:

1. matchscore:
- Give a realistic score between 0 to 100 based on skill match

2. technicalQuestions:
- Generate 5–8 relevant beginner to intermediate level technical questions
- Answers should include approach + key points (not just theory)

3. behavioralQuestions:
- Generate 3–5 common interview behavioral questions
- Use STAR method in answers (Situation, Task, Action, Result)

4. skillgaps:
- Identify real missing or weak skills
- Assign severity properly:
  - low = minor improvement needed
  - medium = important but manageable
  - high = critical gap

5. preparationplan:
- Create at least 5–7 days plan
- Each day must include:
  - practical tasks
  - clear focus (DSA / frontend / backend / HR etc.)

INPUT:

Job Description:
{{jobdescription}}

Resume:
{{resume}}

Self Description:
{{selfdescription}}
                                         `;


   const response = await ai.chat.completions.create({
  model: "deepseek/deepseek-chat",
  messages: [
    {
      role: "user",
      content: prompt
    }
  ]
});

const text = response?.choices?.[0]?.message?.content;

if (!text) {
  console.log("RAW RESPONSE:", response);
  throw new Error("AI returned empty response");
}

const clean = text.replace(/```json|```/g, "").trim();

const parsed = JSON.parse(clean);

return parsed;
}





async function generatePdffromhtml(htmlContent) {

   
const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setContent(htmlContent, { waitUntil: "networkidle0" });
const pdfBuffer = await page.pdf({ format: "A4",margin: { top: "20mm", bottom: "20mm", left: "15mm", right: "15mm" } });
await browser.close();
return pdfBuffer;


}






async function generateResumepdf({ resume, jobdescription, selfdescription }) {

  // 🔥 Trim input (token control)
  const shortResume = resume?.slice(0, 1500) || "";
  const shortJD = jobdescription?.slice(0, 800) || "";
  const shortSelf = selfdescription?.slice(0, 800) || "";

  // 🔥 Strong Prompt (better control)
 const prompt = `
You are an expert ATS resume writer and professional UI resume designer.

Your task is to generate a HIGH ATS-SCORE, clean ONE-PAGE resume in STRICT JSON format.

=====================
OUTPUT RULE (VERY STRICT)
=====================
- Return ONLY valid JSON
- DO NOT add explanation, notes, or markdown
- Output format MUST be exactly:

{"html":"<complete HTML document>"}

- If output is not valid JSON, regenerate correctly

=====================
DESIGN REQUIREMENTS
=====================
- Clean, modern developer resume layout
- White background, black/gray text
- Font: Arial, sans-serif
- Single column (ATS friendly)
- Balanced spacing and margins
- Section headings bold and slightly larger

=====================
STRUCTURE (STRICT ORDER)
=====================

1. HEADER
- Full Name (large bold, h1)
- Contact line: Email | Phone | LinkedIn | GitHub

2. SUMMARY
- 2–3 lines
- Must include role + skills + goal
- Tailored to job description

3. EDUCATION
- Degree, College, Year
- 12th details (short)

4. PROJECTS (MOST IMPORTANT SECTION)
For each project:
- Project Title (bold)
- 2–4 bullet points:
  - Use strong action verbs (Built, Developed, Optimized)
  - Mention impact (performance, users, features)
- Technologies used (inline)
- GitHub / Live link (if available)

5. TECHNICAL SKILLS
- Categorized:
  - Frontend
  - Backend
  - Tools
  - Programming Languages

6. CERTIFICATIONS (if available)

7. ACHIEVEMENTS (if available)

=====================
HTML RULES (STRICT)
=====================
- Use ONLY: h1, h2, p, ul, li
- Inline CSS ONLY (inside tags)
- NO external CSS or JavaScript
- NO tables, NO div nesting overload
- Maintain proper spacing using margin
- Keep layout readable and aligned

=====================
ATS OPTIMIZATION RULES
=====================
- Include keywords from Job Description naturally
- Use industry-standard terms (React, Node.js, REST API, MongoDB etc.)
- Avoid unnecessary symbols or graphics
- Keep text machine-readable

=====================
PDF OPTIMIZATION
=====================
- Must strictly fit ONE PAGE
- No overflow or cut content
- Use compact spacing
- Font size balanced (not too large)

=====================
CONTENT QUALITY RULES
=====================
- Keep content concise and impactful
- Avoid generic lines
- Prefer measurable results (e.g., "Improved performance by 30%")
- Do NOT repeat information

=====================
DATA INPUT
=====================
Job Description:
${shortJD}

Candidate Description:
${shortSelf}

Resume Data:
${shortResume}
`;

  const response = await ai.chat.completions.create({
    model: "deepseek/deepseek-chat",
    messages: [
      { role: "user", content: prompt }
    ],
    max_tokens: 1500, // 🔥 safer
    temperature: 0.5
  });

  const text = response?.choices?.[0]?.message?.content;

  if (!text) {
    console.log("RAW RESPONSE:", response);
    throw new Error("AI returned empty response");
  }

  // 🔥 Advanced JSON extraction (BEST)
  let parsed;

  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.log("Invalid JSON, trying to fix...");

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}") + 1;

    if (start === -1 || end === -1) {
      throw new Error("No valid JSON found in AI response");
    }

    const clean = text.slice(start, end);
    parsed = JSON.parse(clean);
  }

  if (!parsed.html || typeof parsed.html !== "string") {
    throw new Error("Invalid response: HTML missing or incorrect");
  }

  // 🔥 Extra safety (optional)
  const safeHtml = parsed.html.replace(/```/g, "");

  const pdfBuffer = await generatePdffromhtml(safeHtml);

  return pdfBuffer;
}




module.exports = {
    generateInterviewReport,
    generateResumepdf
}

