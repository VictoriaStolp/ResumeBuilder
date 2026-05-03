//Buttons on the Homepage
document.querySelector('#btnAdd').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divHomePage').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnPrintResume').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Print Resume"
    document.querySelector('#divHomePage').style = "display:none"
    document.querySelector('#divPrintResume').style = "display:block"
})

//Buttons on the Add Resume Information page
document.querySelector('#btnJobs').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Job Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddJobInfo').style = "display:block"
})

document.querySelector('#btnEducation').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Education Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddEduInfo').style = "display:block"
})

document.querySelector('#btnInvolvement').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Involvement Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddInvInfo').style = "display:block"
})

document.querySelector('#btnSkill').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Skill Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddSkillInfo').style = "display:block"
})

document.querySelector('#btnCertification').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Certification Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddCertInfo').style = "display:block"
})

document.querySelector('#btnAward').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add Award Information"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divAddAwardInfo').style = "display:block"
})

document.querySelector('#btnBack').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "WorkingGirlie-ResumeBuilder"
    document.querySelector('#divAddResumeInfo').style = "display:none"
    document.querySelector('#divHomePage').style = "display:block"
})

//Buttons on the Add Job Information Page
document.querySelector('#btnBackToResumeInfo1').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddJobInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})


document.querySelector('#btnSubmitJob').addEventListener('click', ()=>{
    let strCompanyName = document.querySelector('#txtCompanyName').value
    let strPositionName = document.querySelector('#txtPositionName').value
    let strLocation = document.querySelector('#txtLocation').value
    let strStartDate = document.querySelector('#txtStartDate').value
    let strEndDate = document.querySelector('#txtEndDate').value
    let strJobRes1 = document.querySelector('#txtJobRes1').value
    let strJobRes2 = document.querySelector('#txtJobRes2').value



    strCompanyName = strCompanyName.trim()
    strPositionName = strPositionName.trim()
    strLocation = strLocation.trim()
    strStartDate = strStartDate.trim()
    strEndDate = strEndDate.trim()
    strJobRes1 = strJobRes1.trim()
    strJobRes2 = strJobRes2.trim()

    let blnError = false
    let strMessage = ``

    if(strCompanyName.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Company Name</p>`
    }

    if(strPositionName.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Position Name</p>'
    }

    if(strLocation.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Location</p>`
    }

    if(strStartDate.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Start Date</p>'
    }

    if(strEndDate.length < 1){
        blnError = true
        strMessage += '<p>You must enter a End Date</p>'
    }

    if(strJobRes1.length < 1 || strJobRes2.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Job Responsibility</p>'
    }

    let strBaseURL = "http://localhost:8000/jobs"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({companyName:strCompanyName,positionName:strPositionName,location:strLocation,startDate:strStartDate,endDate:strEndDate})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {
            let strJobID = data.jobID
            fetch(strBaseURL + "/responsibilities",
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({jobID:strJobID,description:strJobRes1})
            })
            .then(result => {   
                if(result.ok){
                    return result.json()
                } else{
                    throw new Error(result.status)
                }
            })
            .then(data => {
                fetch(strBaseURL + "/responsibilities",
                {   
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body:
                        JSON.stringify({jobID:strJobID,description:strJobRes2})
                })
                .then(result => {   
                    if(result.ok){
                        return result.json()
                    } else{
                        throw new Error(result.status)
                    }
                })
                .then(data => {
                    if(data){    //Checking the truthyness of our result
                        Swal.fire({
                            title: "Job",
                            text: "Congratulations you added a New Job!",
                            icon: "success"
                        })
                    } else {
                        Swal.fire({
                            title:"Oh no, something went wrong!",
                            icon:"error",
                            text: data.Error
                        })
                    }
                })
            })
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on the add Education Information Page
document.querySelector('#btnBackToResumeInfo2').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddEduInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnSubmitEdu').addEventListener('click', ()=>{
    let strCollegeName = document.querySelector('#txtCollegeName').value
    let strMajor = document.querySelector('#txtMajor').value
    let strConcentration = document.querySelector('#txtConcentration').value
    let strGraduationDate = document.querySelector('#txtGraduationDate').value
    let strLocation = document.querySelector('#txtEduLocation').value


    strCollegeName = strCollegeName.trim()
    strMajor = strMajor.trim()
    strConcentration = strConcentration.trim()
    strGraduationDate = strGraduationDate.trim()
    strLocation = strLocation.trim()

    let blnError = false
    let strMessage = ``

    if(strCollegeName.length < 1){
        blnError = true
        strMessage += `<p>You must enter a College Name</p>`
    }

    if(strMajor.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Major</p>'
    }

    if(strConcentration.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Concentration</p>`
    }

    if(strGraduationDate.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Graduation Date</p>'
    }

    if(strLocation.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Location</p>'
    }

    let strBaseURL = "http://localhost:8000/education"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({collegeName:strCollegeName,major:strMajor,concentration:strConcentration,graduationDate:strGraduationDate,location:strLocation})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            if(data){    //Checking the truthyness of our result
                Swal.fire({
                    title: "Education",
                    text: "Congratulations you added a New Education!",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: data.Error
                })
            }
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on the Add Involvement Information Page
document.querySelector('#btnBackToResumeInfo3').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddInvInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnSubmitInv').addEventListener('click', ()=>{
    let strOrgName = document.querySelector('#txtOrgName').value
    let strPositionName = document.querySelector('#txtInvPositionName').value
    let strLocation = document.querySelector('#txtInvLocation').value
    let strStartDate = document.querySelector('#txtInvStartDate').value
    let strEndDate = document.querySelector('#txtInvEndDate').value
    let strInvRes1 = document.querySelector('#txtInvRes1').value
    let strInvRes2 = document.querySelector('#txtInvRes2').value


    strOrgName = strOrgName.trim()
    strPositionName = strPositionName.trim()
    strLocation = strLocation.trim()
    strStartDate = strStartDate.trim()
    strEndDate = strEndDate.trim()
    strInvRes1 = strInvRes1.trim()
    strInvRes2 = strInvRes2.trim()

    let blnError = false
    let strMessage = ``

    if(strOrgName.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Organization Name</p>`
    }

    if(strPositionName.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Position Name</p>'
    }

    if(strLocation.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Location</p>`
    }

    if(strStartDate.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Start Date</p>'
    }

    if(strEndDate.length < 1){
        blnError = true
        strMessage += '<p>You must enter a End Date</p>'
    }

    if(strInvRes1.length < 1 || strInvRes2.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Involvement Responsibility</p>'
    }

    let strBaseURL = "http://localhost:8000/involvement"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({organizationName:strOrgName,positionName:strPositionName,location:strLocation,startDate:strStartDate,endDate:strEndDate})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            let strInvID = data.invID
            console.log(strInvID)
            fetch(strBaseURL + "/responsibilities",
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({invID:strInvID,description:strInvRes1})
            })
            .then(result => {   
                if(result.ok){
                    return result.json()
                } else{
                    throw new Error(result.status)
                }
            })
            .then(data => {
                fetch(strBaseURL + "/responsibilities",
                {   
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body:
                        JSON.stringify({invID:strInvID,description:strInvRes2})
                })
                .then(result => {   
                    if(result.ok){
                        return result.json()
                    } else{
                        throw new Error(result.status)
                    }
                })
                .then(data => {
                    if(data){    //Checking the truthyness of our result
                        Swal.fire({
                            title: "Involvement",
                            text: "Congratulations you added a New Involvement!",
                            icon: "success"
                        })
                    } else {
                        Swal.fire({
                            title:"Oh no, something went wrong!",
                            icon:"error",
                            text: data.Error
                        })
                    }
                })
            })
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on the Add Skill Information Page
document.querySelector('#btnBackToResumeInfo4').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddSkillInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnSubmitSkill').addEventListener('click', ()=>{
    let strSkillName = document.querySelector('#txtSkillName').value
    let strCategoryName = document.querySelector('#txtCategoryName').value


    strSkillName = strSkillName.trim()
    strCategoryName = strCategoryName.trim()

    let blnError = false
    let strMessage = ``

    if(strSkillName.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Skill Name</p>`
    }

    if(strCategoryName.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Category Name</p>'
    }

    let strBaseURL = "http://localhost:8000/skills"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({skillName:strSkillName,categoryName:strCategoryName})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            if(data){    //Checking the truthyness of our result
                Swal.fire({
                    title: "Skill",
                    text: "Congratulations you added a New Skill!",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: data.Error
                })
            }
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on the add Certification Information Page
document.querySelector('#btnBackToResumeInfo5').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddCertInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnSubmitCert').addEventListener('click', ()=>{
    let strCertOrgName = document.querySelector('#txtCertOrgName').value
    let strCertName = document.querySelector('#txtCertificationName').value


    strCertOrgName = strCertOrgName.trim()
    strCertName = strCertName.trim()

    let blnError = false
    let strMessage = ``

    if(strCertOrgName.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Certificate Organization Name</p>`
    }

    if(strCertName.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Certification Name</p>'
    }

    let strBaseURL = "http://localhost:8000/certification"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({certificateOrgName:strCertOrgName,certificationName:strCertName})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            if(data){    //Checking the truthyness of our result
                Swal.fire({
                    title: "Certification",
                    text: "Congratulations you added a New Certification!",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: data.Error
                })
            }
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on the add Award Information Page
document.querySelector('#btnBackToResumeInfo6').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "AddResumeInfo-Options"
    document.querySelector('#divAddAwardInfo').style = "display:none"
    document.querySelector('#divAddResumeInfo').style = "display:block"
})

document.querySelector('#btnSubmitAward').addEventListener('click', ()=>{
    let strAwardName = document.querySelector('#txtAwardName').value
    let strAwardingOrgName = document.querySelector('#txtAwardingOrgName').value
    let strDescription = document.querySelector('#txtDescription').value
    let strDateAwarded = document.querySelector('#txtDateAwarded').value

    strAwardName = strAwardName.trim()
    strAwardingOrgName = strAwardingOrgName.trim()
    strDescription = strDescription.trim()
    strDateAwarded = strDateAwarded.trim()

    let blnError = false
    let strMessage = ``

    if(strAwardName.length < 1){
        blnError = true
        strMessage += `<p>You must enter an Award Name</p>`
    }

    if(strAwardingOrgName.length < 1){
        blnError = true
        strMessage += '<p>You must enter an Awarding Organization Name</p>'
    }
    
    if(strDescription.length < 1){
        blnError = true
        strMessage += '<p>You must enter a Description</p>'
    }

    let strBaseURL = "http://localhost:8000/awards"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({awardName:strAwardName,awardingOrgName:strAwardingOrgName,description:strDescription,dateAwarded:strDateAwarded})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            if(data){    //Checking the truthyness of our result
                Swal.fire({
                    title: "Award",
                    text: "Congratulations you added a New Award!",
                    icon: "success"
                })
            } else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: data.Error
                })
            }
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//Buttons on Print Resume Page
document.querySelector('#btnSubmitAPIKey').addEventListener('click', ()=>{
    let strGeminiAPIKey = document.querySelector('#txtGeminiAPIKey').value

    strGeminiAPIKey = strGeminiAPIKey.trim()

    let blnError = false
    let strMessage = ``

    if(strGeminiAPIKey.length < 1){
        blnError = true
        strMessage += `<p>You must enter a Gemini API Key</p>`
    }

    let strBaseURL = "http://localhost:8000/GeminiAPIKey"
    if(blnError == false){
        fetch(strBaseURL,
            {   
                method: 'POST',
                headers: {
                    'Content-Type':'application/json'
                },
                body:
                    JSON.stringify({geminiAPIKey:strGeminiAPIKey})
            }
        )
        .then(result => {   
            if(result.ok){
                return result.json()
            } else{
                throw new Error(result.status)
            }
        })
        .then(data => {  //Alerting the User
            if(data){    //Checking the truthyness of our result
                Swal.fire({
                    title: "Gemini API Key",
                    text: "Congratulations you added a New Gemini API Key!",
                    icon: "success"
                })
                document.title = "Print Resume"
                document.querySelector('#divPrintResume').style = "display:none"
                document.querySelector('#divResumeTemplate').style = "display:block"
            } else {
                Swal.fire({
                    title:"Oh no, something went wrong!",
                    icon:"error",
                    text: data.Error
                })
            }
        })

    }else{
        Swal.fire({
            title:"Oh no, something went wrong!",
            icon:"error",
            html:strMessage
        })
    }
})

//AI Generated by Codex
document.querySelector('#btnBackFromResumeTemplate').addEventListener('click', ()=>{
    document.title = "WorkingGirlie-ResumeBuilder"
    document.querySelector('#divResumeTemplate').style = "display:none"
    document.querySelector('#divHomePage').style = "display:block"
})