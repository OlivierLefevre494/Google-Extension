document.getElementById("savechanges").addEventListener("click", SaveChanges);
document.getElementById("addnew").addEventListener("click", AddNew)
document.getElementById("removetextbox").addEventListener("click", RemoveTextbox)
//chrome.storage.local.get("blockingstatus").then((results) => {
//if (results["blockingstatus"]==1) {
//    document.getElementById("blockingstatus").checked = true
//} else {
//    document.getElementById("blockingstatus").checked = false
//}
//})

//function savechanges() {
//    if (document.getElementById("blockingstatus").checked) {
//        chrome.storage.local.set({"blockingstatus" : 1})
//    } else {
//        chrome.storage.local.set({"blockingstatus" : 0})
//    }
//}

const categorylist = {'social media' : ["instagram","twitter.com", "X.com", "facebook.com"]}

function AddNew(placeholder) {
    var textbox = document.createElement("input")
    textbox.placeholder = "Input Blocking Keyword"
    if (placeholder!="" && placeholder!="[object PointerEvent]") {
        textbox.value = placeholder
    }
    textbox.classList.add("keywordname")
    document.body.insertBefore(textbox, document.getElementById("removetextbox"))
}


function RemoveTextbox() {
    if (document.body.getElementsByClassName("keywordname").length != 0) {
        document.body.getElementsByClassName("keywordname")[document.body.getElementsByClassName("keywordname").length - 1].remove()
    }
}


function SaveChanges() {
    var websitelist=[]
    var websites = document.body.getElementsByClassName("keywordname")
    var x = 0
    while (x<document.body.getElementsByClassName("keywordname").length) {
        if (websites[x].value != '' && websites[x].value != ' ') {
            if (websites[x].value in categorylist) {
                websitelist.push([websites[x].value, categorylist[websites[x].value]])
            } else { 
                websitelist.push(websites[x].value)
            }
        }
        x = x+1
    }
    chrome.storage.local.set({"blocked" : websitelist})
    console.log(websitelist)
}

chrome.storage.local.get("blocked").then((results) => {
    console.log(results["blocked"])
    for (let x in results["blocked"]) {
        if (Array.isArray(results["blocked"][x])) {
            AddNew(results["blocked"][x][0])
        } else {
            AddNew(results["blocked"][x])
        }
   }
})