//NOTES: 
// - Go back through and check the error codes
//Error Codes: 200 - OK, 201 - resulted in the creation of one or more new resources
const{GoogleGenAI}= require('@google/genai')
require('dotenv').config()
const cors = require('cors')
const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const {v4:uuidv4}= require('uuid')

const HTTP_PORT = 8000
let GEMINI_API_KEY = ''

var app = express() //This creates a new instance of express
app.use(express.json())
app.use(cors())

let genAI = ''

const model = "gemini-3-flash-preview"

const dbResume = new sqlite3.Database('resume.db', (err) => {
    if(err){
        console.error("Error opening database:", err.message)
    } else {
        console.log("Connected to resume.db")
    }
})

app.listen(HTTP_PORT, () => {
    console.log('Listening on', HTTP_PORT)
})

app.post("/GeminiAPIKey", (req,res) => {
    GEMINI_API_KEY = req.body.geminiAPIKey
    if(!GEMINI_API_KEY){
        res.status(401).json({message:"All items must be provided"})
    }
    
    if(GEMINI_API_KEY.length < 1){
        res.status(500).json({outcome:"error", message:"It didn't work"})
     } else {
        genAI = new GoogleGenAI(GEMINI_API_KEY)
        res.status(201).json({outcome:"success",message:`You added your Gemini API Key!`})
    }
})

app.post("/jobs", (req,res) => {
    let strJobID = uuidv4()
    let strCompanyName = req.body.companyName.trim()
    let strPositionName = req.body.positionName.trim()
    let strLocation = req.body.location.trim()
    let strStartDate = req.body.startDate.trim()
    let strEndDate = req.body.endDate.trim()

    if(!strJobID || !strCompanyName || !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblJobs VALUES (?,?,?,?,?,?)"
    dbResume.run(strQuery,[strJobID,strCompanyName,strPositionName,strLocation,strStartDate,strEndDate], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted job with id ${strJobID}`,jobID:strJobID})
        }
    })
})

app.post("/GeminiAPI", async (req, res) => {
    const strResponsibility = req.body.responsibilities;
 
    // 1. Validate first to prevent unnecessary API calls
    if (!strResponsibility) {
        return res.status(400).json({ message: "Responsibilities are required" });
    }
 
    try {
        const prompt = `Make this sound better for a resume: ${strResponsibility}`;
        // 2. Use 'await' to wait for the API response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
 
        // 3. Send the actual text back
        res.status(200).json({ response: text });
    } catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get("/jobs", (req,res) => {
    const strQuery = "SELECT * FROM tblJobs"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:rows})
        }
    })
})

app.put("/jobs", (req,res) => {
    let strJobID = req.body.jobID
    let strCompanyName = req.body.companyName.trim()
    let strPositionName = req.body.positionName.trim()
    let strLocation = req.body.location.trim()
    let strStartDate = req.body.startDate.trim()
    let strEndDate = req.body.endDate.trim()
    //Add the foreign key for the job responsibilities table


    if(!strJobID || !strCompanyName || !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "UPDATE tblJobs SET companyName=?,positionName=?,location=?,startDate=?,endDate=? WHERE jobID=?"
    dbResume.run(strQuery,[strCompanyName,strPositionName,strLocation,strStartDate,strEndDate,strJobID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Updated job with id ${strJobID}`})
        }
    })
})

app.delete("/jobs", (req,res) => {
    let strJobID = req.body.jobID

    if(!strJobID){
        res.status(401).json({message:"Please enter the ID of the Job you want to remove"})
    }

    const strQuery = "DELETE FROM tblJobs WHERE jobID=?"
    dbResume.run(strQuery,[strJobID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:`Deleted job with id ${strJobID}`})
        }
    })
})

app.post("/jobs/responsibilities", (req,res) => {
    let strJobResID = uuidv4()
    let strJobID = req.body.jobID //Foreign key
    let strDescription = req.body.description.trim()


    if(!strJobResID || !strJobID || !strDescription){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblJobResponsibilities VALUES (?,?,?)"
    dbResume.run(strQuery,[strJobResID,strJobID,strDescription], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted job responsibility with id ${strJobResID}`})
        }
    })
})

app.get("/jobs/responsibilities", (req,res) => {
    let strJobID = req.body.jobID //Foreign key

    if(!strJobID){
        res.status(401).json({message:"A jobID must be provided"})
    }

    const strQuery = "SELECT * FROM tblJobResponsibilities WHERE jobID=?"
    dbResume.all(strQuery,[strJobID], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:rows})
        }
    })
})

app.post("/education", (req,res) => {
    let strEduID = uuidv4()
    let strCollegeName = req.body.collegeName.trim()
    let strMajor = req.body.major.trim()
    let strConcentration = req.body.concentration.trim()
    let strGraduationDate = req.body.graduationDate.trim()
    let strLocation = req.body.location.trim()

    if(!strEduID || !strCollegeName|| !strMajor || !strConcentration || !strGraduationDate || !strLocation){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblEducation VALUES (?,?,?,?,?,?)"
    dbResume.run(strQuery,[strEduID,strCollegeName,strMajor,strConcentration,strGraduationDate,strLocation], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted education with id ${strEduID}`})
        }
    })
})

app.get("/education", (req,res) => {
    const strQuery = "SELECT * FROM tblEducation"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:rows})
        }
    })
})

app.put("/education", (req,res) => {
    let strEduID = req.body.eduID
    let strCollegeName = req.body.collegeName.trim()
    let strMajor = req.body.major.trim()
    let strConcentration = req.body.concentration.trim()
    let strGraduationDate = req.body.graduationDate.trim()
    let strLocation = req.body.location.trim()

    if(!strEduID || !strCollegeName|| !strMajor || !strConcentration || !strGraduationDate || !strLocation){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "UPDATE tblEducation SET collegeName=?,major=?,concentration=?,graduationDate=?,location=? WHERE eduID=?"
    dbResume.run(strQuery,[strCollegeName,strMajor,strConcentration,strGraduationDate,strLocation,strEduID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Updated education with id ${strEduID}`})
        }
    })
})

app.delete("/education", (req,res) => {
    let strEduID = req.body.eduID

    if(!strEduID){
        res.status(401).json({message:"Please enter the ID of the Education you want to remove"})
    }

    const strQuery = "DELETE FROM tblEducation WHERE eduID=?"
    dbResume.run(strQuery,[strEduID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:`Deleted education with id ${strEduID}`})
        }
    })
})

app.post("/involvement", (req,res) => {
    let strInvID = uuidv4()
    let strOrganizationName = req.body.organizationName.trim()
    let strPositionName = req.body.positionName.trim()
    let strLocation = req.body.location.trim()
    let strStartDate = req.body.startDate.trim()
    let strEndDate = req.body.endDate.trim()

    if(!strInvID || !strOrganizationName|| !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblInvolvement VALUES (?,?,?,?,?,?)"
    dbResume.run(strQuery,[strInvID,strOrganizationName,strPositionName,strLocation,strStartDate,strEndDate], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted Organization with id ${strInvID}`,invID:strInvID})
        }
    })
})

app.get("/involvement", (req,res) => {
    const strQuery = "SELECT * FROM tblInvolvement"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:rows})
        }
    })
})

app.put("/involvement", (req,res) => {
    let strInvID = req.body.invID
    let strOrganizationName = req.body.organizationName.trim()
    let strPositionName = req.body.positionName.trim()
    let strLocation = req.body.location.trim()
    let strStartDate = req.body.startDate.trim()
    let strEndDate = req.body.endDate.trim()
    //Create another table for Responsibilites and add foreign key here

    if(!strInvID || !strOrganizationName|| !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "UPDATE tblInvolvement SET organizationName=?,positionName=?,location=?,startDate=?,endDate=? WHERE invID=?"
    dbResume.run(strQuery,[strOrganizationName,strPositionName,strLocation,strStartDate,strEndDate,strInvID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Updated Organization with id ${strInvID}`})
        }
    })
})

app.delete("/involvement", (req,res) => {
    let strInvID = req.body.invID

    if(!strInvID){
        res.status(401).json({message:"Please enter the ID of the Organization you want to remove"})
    }

    const strQuery = "DELETE FROM tblInvolvement WHERE invID=?"
    dbResume.run(strQuery,[strInvID], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:`Deleted organization with id ${strInvID}`})
        }
    })
})

app.post("/involvement/responsibilities", (req,res) => {
    let strInvResID = uuidv4()
    let strInvID = req.body.invID.trim()
    let strDescription = req.body.description.trim()

    if(!strInvResID || !strInvID|| !strDescription){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblInvolvementResponsibilities VALUES (?,?,?)"
    dbResume.run(strQuery,[strInvResID,strInvID,strDescription], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted responsibility with id ${strInvResID}`})
        }
    })
})

app.get("/involvement/responsibilities", (req,res) => {
    let strInvID = req.body.invID.trim()

    if(!strInvID){
        res.status(401).json({message:"A InvID must be provided"})
    }

    const strQuery = "SELECT * FROM tblInvolvementResponsibilities WHERE invID=?"
    dbResume.run(strQuery,[strInvResID], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:rows})
        }
    })
})

app.post("/skills", (req,res) => {
    let strSkillID = uuidv4()
    let strSkillName = req.body.skillName.trim()
    let strCategoryName = req.body.categoryName.trim()

    if(!strSkillID || !strSkillName|| !strCategoryName){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblSkills VALUES (?,?,?)"
    dbResume.run(strQuery,[strSkillID,strSkillName,strCategoryName], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted skill with id ${strSkillID}`})
        }
    })
})

app.get("/skills", (req,res) => {
    const strQuery = "SELECT * FROM tblSkills"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:rows})
        }
    })
})

app.post("/certification", (req,res) => {
    let strCertID = uuidv4()
    let strCertificateOrgName = req.body.certificateOrgName.trim()
    let strCertificationName = req.body.certificationName.trim()

    if(!strCertID || !strCertificateOrgName|| !strCertificationName){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblCertification VALUES (?,?,?)"
    dbResume.run(strQuery,[strCertID,strCertificateOrgName,strCertificationName], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted certification with id ${strCertID}`})
        }
    })
})

app.get("/certification", (req,res) => {
    const strQuery = "SELECT * FROM tblCertification"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:rows})
        }
    })
})

app.post("/awards", (req,res) => {
    let strAwardID = uuidv4()
    let strAwardName = req.body.awardName.trim()
    let strAwardingOrgName = req.body.awardingOrgName.trim()
    let strDescription = req.body.description.trim()
    let strDateAwarded = req.body.dateAwarded.trim()

    if(!strAwardID || !strAwardName || !strAwardingOrgName || !strDescription || !strDateAwarded){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblAwards VALUES (?,?,?,?,?)"
    dbResume.run(strQuery,[strAwardID,strAwardName,strAwardingOrgName,strDescription,strDateAwarded], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted award with id ${strAwardID}`})
        }
    })
})

app.get("/awards", (req,res) => {
    const strQuery = "SELECT * FROM tblAwards"
    dbResume.all(strQuery,[], function(err,rows){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(200).json({outcome:"success",message:rows})
        }
    })
})


//Start of code generated by Codex AI
function dbAll(strQuery, arrParams = []){
    return new Promise((resolve,reject) => {
        dbResume.all(strQuery,arrParams,(err,rows) => {
            if(err){
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

app.get("/resume-data", async (req,res) => {
    try{
        //This is getting all of the information from the databases
        const jobs = await dbAll("SELECT * FROM tblJobs")
        const jobResponsibilities = await dbAll("SELECT * FROM tblJobResponsibilities")
        const education = await dbAll("SELECT * FROM tblEducation")
        const involvement = await dbAll("SELECT * FROM tblInvolvement")
        const involvementResponsibilities = await dbAll("SELECT * FROM tblInvolvementResponsibilities")
        const skills = await dbAll("SELECT * FROM tblSkills")
        const certifications = await dbAll("SELECT * FROM tblCertification")
        const awards = await dbAll("SELECT * FROM tblAwards")

        //This is getting the job responsibilities for each of the jobs
        const jobsWithResponsibilities = jobs.map(job => ({
            ...job,
            responsibilities: jobResponsibilities.filter(responsibility => responsibility.jobID == job.jobID)
        }))

        //This is getting the involvement responsibilities for each of the involvements
        const involvementWithResponsibilities = involvement.map(item => ({
            ...item,
            responsibilities: involvementResponsibilities.filter(responsibility => responsibility.invID == item.invID)
        }))

        //This is sending everything to the frontend
        res.status(200).json({
            outcome:"success",
            message:{
                jobs:jobsWithResponsibilities,
                education:education,
                involvement:involvementWithResponsibilities,
                skills:skills,
                certifications:certifications,
                awards:awards
            }
        })
    } catch(err){
        res.status(500).json({outcome:"error",message:err.message})
    }
})

//End of code Generated by Codex AI