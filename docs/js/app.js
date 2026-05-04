
Swal.fire({
    title: "Thank You",
    text: "This Application was made with Bootstrap, Bootswatch, SweetAlert, Gemini API, Sqlite, Express, CORS, UUID, and dotenv!",
    icon: "success"
})

//Buttons on the Homepage
document.querySelector('#btnAdd').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Add API Key"
    document.querySelector('#divHomePage').style = "display:none"
    document.querySelector('#divAPIKey').style = "display:block"
})

document.querySelector('#btnPrintResume').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "Print Resume"
    document.querySelector('#divHomePage').style = "display:none"
    document.querySelector('#divSelectResumeItems').style = "display:block"
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

    let strBaseURL = "http://localhost:8000/"
    if(blnError == false){
        fetch(strBaseURL + "jobs",
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
            fetch(strBaseURL + "GeminiAPI",
                {   
                    method: 'POST',
                    headers: {
                        'Content-Type':'application/json'
                    },
                    body:
                        JSON.stringify({responsibilities:strJobRes1})
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
                Swal.fire({
                    title: "Gemini Suggestion",
                    text: data.response,
                    icon: "success"
                })
            })      
            
            fetch(strBaseURL + "jobs/responsibilities",
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
                fetch(strBaseURL + "jobs/responsibilities",
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
                document.title = "Add Resume Info-Options"
                document.querySelector('#divAPIKey').style = "display:none"
                document.querySelector('#divAddResumeInfo').style = "display:block"
                loadResumeChoices()
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

document.querySelector('#btnBackToHomepage').addEventListener('click', ()=>{
    //This changes the title back
    document.title = "WorkingGirlie-ResumeBuilder"
    document.querySelector('#divAPIKey').style = "display:none"
    document.querySelector('#divHomePage').style = "display:block"
})

//Resume template builder
//Start of Code Generated by Codex AI
//Creates a json object that has arrays for each of the different categories
let objResumeData = {
    jobs: [],
    education: [],
    involvement: [],
    skills: [],
    certifications: [],
    awards: []
}
//This is telling you where to get the information from and giving it the choice of a singular key and a plural key just in case and then creating the format for how it is going to appear on the screen
const arrChoiceSections = [
    ['#divEducationChoices', 'education', 'education', edu => `${edu.collegeName} - ${edu.major}`],
    ['#divJobChoices', 'job', 'jobs', job => `${job.companyName} - ${job.positionName}`],
    ['#divInvolvementChoices', 'involvement', 'involvement', inv => `${inv.organizationName} - ${inv.positionName}`],
    ['#divSkillChoices', 'skill', 'skills', skill => `${skill.skillName} (${skill.categoryName})`],
    ['#divCertificationChoices', 'certification', 'certifications', cert => `${cert.certificationName} - ${cert.certificateOrgName}`],
    ['#divAwardChoices', 'award', 'awards', award => `${award.awardName} - ${award.awardingOrgName}`]
]

//This is used to make sure that the user isn't trying to send in javascript or html to break the application
function escapeHTML(strValue){
    return String(strValue || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;')
}

//This is creating the checkboxes and the label
function makeChoice(strType, intIndex, strLabel){
    return `<div class="form-check">
        <input class="form-check-input resume-choice" type="checkbox" checked data-type="${strType}" data-index="${intIndex}" id="${strType}${intIndex}">
        <label class="form-check-label" for="${strType}${intIndex}">${escapeHTML(strLabel)}</label>
    </div>`
}

//Takes resume data and renders it into checkbox sections on the page
function renderChoices(){
    arrChoiceSections.forEach(([strSelector, strType, strDataKey, fnLabel]) => {
        let arrItems = objResumeData[strDataKey]
        document.querySelector(strSelector).innerHTML = arrItems.length < 1
            ? '<p class="text-muted">No items have been added yet.</p>'
            : arrItems.map((item, index) => makeChoice(strType, index, fnLabel(item))).join('')
    })
}
//Loads resume data from the backend and then displays it on the page
function loadResumeChoices(){
    fetch('http://localhost:8000/resume-data')
        .then(result => {
            if(result.ok){
                return result.json()
            }
            throw new Error(result.status)
        })
        .then(data => {
            objResumeData = data.message
            renderChoices()
        })
        .catch(() => {
            Swal.fire({
                title: 'Oh no, something went wrong!',
                icon: 'error',
                text: 'The resume information could not be loaded. Make sure the backend is running.'
            })
        })
}

//This is seeing which items where checked
function checkedItems(strType, strDataKey){
    return Array.from(document.querySelectorAll(`.resume-choice[data-type="${strType}"]:checked`))
        .map(choice => objResumeData[strDataKey][Number(choice.dataset.index)])
}

//This is creating the bullet points for the responsibilities
function makeBullets(arrResponsibilities){
    let arrDescriptions = (arrResponsibilities || [])
        .map(item => item.description || item)
        .filter(item => item && item.trim().length > 0)

    if(arrDescriptions.length < 1){
        return ''
    }

    return `<ul class="mt-2">${arrDescriptions.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
}

//This is making the format for the different sections (jobs, involvement)
function makeEntry(objItem, strName, strTitle){
    return `<div class="ms-5 mb-4">
        <div class="d-flex justify-content-between">
            <span class="fw-bold">${escapeHTML(objItem[strName])}</span>
            <span class="fw-bold">${escapeHTML(objItem.location)}</span>
        </div>
        <div class="d-flex justify-content-between">
            <span class="text-decoration-underline">${escapeHTML(objItem[strTitle])}</span>
            <span>${escapeHTML(objItem.startDate)} - ${escapeHTML(objItem.endDate)}</span>
        </div>
        ${makeBullets(objItem.responsibilities)}
    </div>`
}

//This makes the award details format
function makeAward(objAward){
    return `<div class="ms-5 mb-4">
        <div class="d-flex justify-content-between">
            <span class="fw-bold">${escapeHTML(objAward.awardName)}</span>
            <span>${escapeHTML(objAward.dateAwarded)}</span>
        </div>
        <div>${escapeHTML(objAward.awardingOrgName)}</div>
        <p class="mb-0">${escapeHTML(objAward.description)}</p>
    </div>`
}

//Set text inside an HTML element
function setText(strSelector, strValue){
    document.querySelector(strSelector).textContent = strValue || ''
}

//This shows or hides a section on the page depending on whether it has data
function toggleSection(strSelector, arrItems){
    document.querySelector(strSelector).style = arrItems.length > 0 ? 'display:block' : 'display:none'
}

//This is building the whole resume template
function buildResumeTemplate(){
    let arrEducation = checkedItems('education', 'education')
    let arrJobs = checkedItems('job', 'jobs')
    let arrInvolvement = checkedItems('involvement', 'involvement')
    let arrSkills = checkedItems('skill', 'skills')
    let arrCertifications = checkedItems('certification', 'certifications')
    let arrAwards = checkedItems('award', 'awards')

    let strFullName = document.querySelector('#txtResumeFullName').value.trim()

    if(strFullName.length < 1){
        Swal.fire({
            title: "Missing Name",
            text: "You must enter the person's full name.",
            icon: "error"
        })
        return
    }

    setText('#resumeName', strFullName)
    setText('#resumeLinkedIn', document.querySelector('#txtResumeLinkedIn').value.trim())
    setText('#resumePhone', document.querySelector('#txtResumePhone').value.trim())
    setText('#resumeLocation', document.querySelector('#txtResumeLocation').value.trim())
    setText('#resumeEmail', document.querySelector('#txtResumeEmail').value.trim())

    if(arrEducation.length > 0){
        let edu = arrEducation[0]
        setText('#resumeSchool', edu.collegeName)
        setText('#resumeSchoolLocation', edu.location)
        setText('#resumeMajor', `Major: ${edu.major}`)
        setText('#resumeGraduation', edu.graduationDate)
        setText('#resumeConcentration', edu.concentration ? `Concentration: ${edu.concentration}` : '')
        setText('#resumeGpa', '')
    }

    document.querySelector('#resumeExperienceList').innerHTML = arrJobs.map(job => makeEntry(job, 'companyName', 'positionName')).join('')
    document.querySelector('#resumeLeadershipList').innerHTML = arrInvolvement.map(inv => makeEntry(inv, 'organizationName', 'positionName')).join('')
    setText('#resumeSkills', arrSkills.map(skill => skill.skillName).join(', '))
    setText('#resumeCertifications', arrCertifications.map(cert => `${cert.certificationName} - ${cert.certificateOrgName}`).join(', '))
    document.querySelector('#resumeAwardsList').innerHTML = arrAwards.map(makeAward).join('')

    toggleSection('#educationSection', arrEducation)
    toggleSection('#experienceSection', arrJobs)
    toggleSection('#leadershipSection', arrInvolvement)
    toggleSection('#skillsSection', arrSkills)
    toggleSection('#certificationsSection', arrCertifications)
    toggleSection('#awardsSection', arrAwards)

    document.title = 'Resume Template'
    document.querySelector('#divSelectResumeItems').style = 'display:none'
    document.querySelector('#divResumeTemplate').style = 'display:block'
}

//Button to create the template
document.querySelector('#btnCreateResumeTemplate').addEventListener('click', ()=>{
        Swal.fire({
            title: "Printing",
            text: "Press Ctrl+p to print out the resume",
            icon: "success"
        })
    buildResumeTemplate()
})

//Button to go back to the homepage from select resume items
document.querySelector('#btnBackToPrintResume').addEventListener('click', ()=>{
    document.title = 'WorkingGirlie-ResumeBuilder'
    document.querySelector('#divSelectResumeItems').style = 'display:none'
    document.querySelector('#divHomePage').style = 'display:block'
})

//Button to go back to the homepage from the resume page
document.querySelector('#btnBackFromResumeTemplate').addEventListener('click', ()=>{
    document.title = 'WorkingGirlie-ResumeBuilder'
    document.querySelector('#divResumeTemplate').style = 'display:none'
    document.querySelector('#divHomePage').style = 'display:block'
})

//End of Code Generated by Codex AI