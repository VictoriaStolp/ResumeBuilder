//NOTES: 
// - Go back through and check the error codes
//Error Codes: 200 - OK, 201 - resulted in the creation of one or more new resources

const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const {v4:uuidv4}= require('uuid')

const HTTP_PORT = 8000

var app = express() //This creates a new instance of express
app.use(express.json())

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

app.post("/jobs", (req,res) => {
    let strJobID = uuidv4()
    let strCompanyName = req.body.companyName.trim()
    let strPositionName = req.body.positionName.trim()
    let strLocation = req.body.location.trim()
    let strStartDate = req.body.startDate.trim()
    let strEndDate = req.body.endDate.trim()
    //Add the foreign key for the job responsibilities table


    if(!strJobID || !strCompanyName || !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblJobs VALUES (?,?,?,?,?,?)"
    dbResume.run(strQuery,[strJobID,strCompanyName,strPositionName,strLocation,strStartDate,strEndDate], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted job with id ${strJobID}`})
        }
    })
})

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
    //Create another table for Responsibilites and add foreign key here

    if(!strInvID || !strOrganizationName|| !strPositionName || !strLocation || !strStartDate || !strEndDate){
        res.status(401).json({message:"All items must be provided"})
    }

    const strQuery = "INSERT INTO tblInvolvement VALUES (?,?,?,?,?,?)"
    dbResume.run(strQuery,[strInvID,strOrganizationName,strPositionName,strLocation,strStartDate,strEndDate], function(err){
        if(err){
            res.status(500).json({outcome:"error", message:err.message})
        } else {
            res.status(201).json({outcome:"success",message:`Inserted Organization with id ${strInvID}`})
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
