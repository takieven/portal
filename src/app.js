const loginheader = {
        "Host": "takay.csucarig.edu.ph",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Content-Type": "application/json",
        "Content-Length": "39",
        "Origin": "https://portal.csucarig.edu.ph",
        "Connection": "keep-alive",
        "Referer": "https://portal.csucarig.edu.ph/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "TE": "trailers"
}

function generateChecklistheader(token) {
    return {
        "Host": "takay.csucarig.edu.ph",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/114.0",
        "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        "Authorization": "Bearer "+token,
        "Origin": "https://portal.csucarig.edu.ph",
        "DNT": "1",
        "Connection": "keep-alive",
        "Referer": "https://portal.csucarig.edu.ph/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Content-Length": "0",
        "TE": "trailers"
    }
}

async function getToken() {
    let url = "https://takay.csucarig.edu.ph/auth/login"  
 
    let data = {
      "UserID":document.getElementById("username").value,
      "Password":document.getElementById("password").value
    }
  
    let options = {
      'method': 'POST',
      'body': JSON.stringify(data),
      'headers': loginheader,
      //'muteHttpExceptions': true
    }
    
    const response = await fetch(url, options) 
    let json = await response.json()
    return [json["access_token"], response.status]
}

async function getSubs(token) {
    const checklistUrl = "https://takay.csucarig.edu.ph/studentChecklistAdvised"
    const checklistheader = generateChecklistheader(token)

    const response = await fetch(checklistUrl, {"method": "POST", "headers":checklistheader}) 
    let json = await response.json()
    return json[0]
}

function createRow(tbl, c1, c2) {
    let row = tbl.insertRow()

    let gCell = row.insertCell()
    gCell.appendChild(document.createTextNode(c1))

    let nCell = row.insertCell()
    nCell.appendChild(document.createTextNode(c2))
}

function createTable(subjects) {
    let tbl = document.getElementById('grades');
    var total = 0
    var length = subjects.length

    for (let s in subjects) {
        let sub = subjects[s]
        let name = sub["SubjectDescription"]
        let subcode = sub["SubjectCode"].toUpperCase()
        let _grade = sub["Grade"]
        var grade = _grade

        if (Boolean(grade) && !(subcode.split(" ").includes("NSTP")) ) {
            total = total + Number(grade)
        } else {
            length -= 1
        }

        if (!Boolean(_grade)) {
            grade = "NA"
        }

        createRow(tbl, grade, name)

    }

    let gwa = (total/length).toFixed(2)
    createRow(tbl, gwa, "GWA")
}

var statuscode
var token = document.cookie
document.getElementById("submit").addEventListener("click", (event) => {
    event.preventDefault()
    login()
})

async function login() {
    if (!token) {
        [token, statuscode] = await getToken()
        document.cookie = token
    }

    if (statuscode==401) {
        alert("authorization failed check your username/password")
        return
    }


    let subs = await getSubs(token)
    createTable(subs)
}
