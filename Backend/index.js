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