//NOTES: 
// - Go back through and check the error codes

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
            res.status(201).json({outcome:"success",message:rows})
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
            res.status(201).json({outcome:"success",message:`Deleted job with id ${strJobID}`})
        }
    })
})