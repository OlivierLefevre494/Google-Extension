document.getElementById("savechanges").addEventListener("click", SaveChanges);
document.getElementById("addnew").addEventListener("click", PromptUser)
document.getElementById("closepopup").addEventListener("click", ClosePopup)
document.getElementById("addwebsite").addEventListener("click", AddWebsite)

const categories = document.querySelectorAll(".blockeditemdiv2");
categories.forEach(function(category) {
    category.addEventListener("click", function() {
    // do something when the button is clicked
    AddNew(category.lastElementChild.innerHTML)
    ClosePopup()
  });
});

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

function PromptUser() {
    document.getElementById("popup").style.visibility='visible';
}

function AddNew(website) {
    var duplicatecheck = false
    var websites = document.getElementsByClassName('websitename')
    if (websites.length!=0) {
        var x = 0
        while (x<websites.length) {
            if (websites[x].innerHTML.trim()==website.trim()) {
                duplicatecheck = true
            }
            x=x+1
        }
    }
    if (duplicatecheck==false) {
        var div = document.createElement("div")
        div.classList.add("blockeditemdiv")
        var name = document.createElement("p")
        name.innerHTML = website
        name.classList.add("websitename")
        var removebutton = document.createElement("div")
        removebutton.classList.add("remove")
        div.appendChild(name)
        div.appendChild(removebutton)
        removebutton.addEventListener("click", function() {removebutton.parentElement.remove()})
        document.getElementById("listofwebsites").appendChild(div)
    }
}

function AskUser() {
    return null
}

function SaveChanges() {
    var websitelist=[]
    var websites = document.body.getElementsByClassName("websitename")
    var x = 0
    while (x<document.body.getElementsByClassName("websitename").length) {
        if (websites[x].innerHTML.trim() != '') {
            if (websites[x].innerHTML.trim() in categorylist) {
                websitelist.push([websites[x].innerHTML.trim(), categorylist[websites[x].innerHTML.trim()]])
            } else { 
                websitelist.push(websites[x].innerHTML.trim())
            }
        }
        x = x+1
    }
    chrome.storage.local.set({"blocked" : websitelist})
    console.log(websitelist)
}

function ClosePopup() {
    var popup = document.getElementById("popup").style.visibility='hidden'
}

function AddWebsite() {
    var url = document.getElementById("inputurl").value
    document.getElementById("inputurl").value = ''
    if (url.trim()!='') {
        AddNew(url.trim())
    }
    ClosePopup()

}

