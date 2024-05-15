document.getElementById("closepopup").addEventListener("click",ClosePopup)
document.getElementById("addnewgroup").addEventListener("click",OpenPopup)
document.getElementById("option1").addEventListener("click", ShowOption1)
document.getElementById("option2").addEventListener("click", ShowOption2)
document.getElementById("option3").addEventListener("click", ShowOption3)
document.getElementById("addwebsite").addEventListener("click", AddWebsiteSpecific)
document.getElementById("submitgroup").addEventListener("click",SubmitGroup)
document.getElementById('savechanges').addEventListener("click", SaveChanges)
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
const sleep = ms => new Promise(r => setTimeout(r, ms));

grouplist = {}
timelimitlist = {}

LoadState()




const categorylist = {'social media' : ["https://www.instagram","https://www.twitter.com", "tiktok.com", "https://www.X.com", "https://www.facebook.com"]}

AddCategories()



function ClosePopup() {
    document.getElementsByClassName("websitenamepop").length!=0
    document.getElementById('groupname').value = ''
    document.getElementById('duration-input').value = "00:00:00"
    while (document.getElementById('groupelements').firstChild) {
        document.getElementById('groupelements').removeChild(document.getElementById('groupelements').lastChild);
    }
    document.getElementById("popup").style.visibility='hidden';
}

function OpenPopup() {
    document.getElementById("popup").style.visibility='visible';
}

function ShowOption1() {
    document.getElementById("option1display").style.display = 'flex'
    document.getElementById("option2display").style.display = 'none'
    document.getElementById("option3display").style.display = 'none'
}

function ShowOption2() {
    document.getElementById("option2display").style.display = 'flex'
    document.getElementById("option1display").style.display = 'none'
    document.getElementById("option3display").style.display = 'none'
}

function ShowOption3() {
    document.getElementById("option2display").style.display = 'none'
    document.getElementById("option1display").style.display = 'none'
    document.getElementById("option3display").style.display = 'flex'
}

function AddWebsiteSpecific() {
    var websiteurl = document.getElementById("addwebsite").previousElementSibling.value.trim()
    document.getElementById("addwebsite").previousElementSibling.value = ''
    AddGroupElement(websiteurl.trim())
}

function AddGroupElement(url) {
    var otherwebsiteurl = document.getElementsByClassName("websitenamepop")
    var duplicatecheck = false
    var x=0
    if (url!='') {
        if (otherwebsiteurl.length!=0) {
            while (x<otherwebsiteurl.length) {
                if (otherwebsiteurl[x].innerHTML.trim()==url.trim())
                duplicatecheck=true;
                x=x+1
            }
        }
        if (duplicatecheck==false) {
            var grouparea = document.getElementById("groupelements")
            var maindiv = document.createElement('div')
            maindiv.classList.add('blockeditemdiv3')
            var remove = document.createElement('div')
            remove.classList.add('remove')
            remove.addEventListener("click", function() {remove.parentElement.remove()})
            var websiteurl = document.createElement('p')
            websiteurl.innerHTML = url
            websiteurl.classList.add('websitenamepop')
            maindiv.appendChild(websiteurl)
            maindiv.appendChild(remove)
            grouparea.appendChild(maindiv)
        }
    }
}

function SubmitGroup() {
    var x = 0
    var urllist = []
    if (document.getElementsByClassName("websitenamepop").length!=0) {
        //if there is at least 1 thing in group
        if (document.getElementById('groupname').value.trim()!='') {
            var limit = document.getElementById('duration-input').value.trim()
            // regex match input to make sure it is in format 00:00:00
            var regex = new RegExp('([0-9]{2}):([0-9]{2}):([0-9]{2})')
            if (regex.test(limit)) {
                // if there is a group name
                var websiteurls = document.getElementsByClassName("websitenamepop")

                var groupnamevalue = document.getElementById('groupname').value.trim()

                var groups = document.getElementsByClassName('groupname')
                var timelimits = document.getElementsByClassName('timelimit')
                var timelefts = document.getElementsByClassName('timeleft')

                //get all website urls
                while (x<document.getElementsByClassName("websitenamepop").length) {
                    urllist.push(websiteurls[x].innerHTML)
                    x = x+1
                }
                console.log(urllist)
                index = -1
                x = 0
                while (x<groups.length) {
                    //go through all the groups on the page
                    //if the group names are equal, replace it, could ask if user wants to replace it.
                    //if the blockees are equal then replace it
                    if(groups[x].innerHTML.trim()==groupnamevalue.trim() || arrayEquals(grouplist[groups[x].innerHTML.trim()],urllist)) {
                        var index = Array.prototype.indexOf.call(groups[x].parentElement.parentElement.children, groups[x].parentElement);
                        groups[x].parentElement.parentElement.children[index].remove()
                        timelimits[x].parentElement.parentElement.children[index].remove()
                        timelefts[x].parentElement.parentElement.children[index].remove()
                    }
                    x = x+1
                }

                //reset groupname and add group name to table
                document.getElementsByClassName("websitenamepop").length!=0
                document.getElementById('groupname').value = ''
                AddGroupTitle(groupnamevalue, index)
                console.log("---------TESTING---------")
                console.log(grouplist)
                grouplist[groupnamevalue.trim()] = urllist
                console.log(groupnamevalue)
                console.log(urllist)
                console.log(grouplist)
                timelimitlist[groupnamevalue.trim()] = limit
                document.getElementById('duration-input').value = "00:00:00"

                //Add time limit
                AddTimeLimit(limit, index)

                //Add time left
                AddTimeLeft(limit, index, urllist)

                //reset main div
                while (document.getElementById('groupelements').firstChild) {
                    document.getElementById('groupelements').removeChild(document.getElementById('groupelements').lastChild);
                }
        }
        } else {
            //Throw error for not having set a group name
        }
    }
    ClosePopup()
}

function AddGroupTitle(value, index) {
    var groupname = document.createElement('p')
    groupname.innerHTML = value
    groupname.classList.add('groupname')
    var groupnamediv = document.createElement('div')
    groupnamediv.classList.add('item')
    groupnamediv.classList.add('groupnamediv')
    groupnamediv.appendChild(groupname)
    var groups = document.getElementById('groups')
    if (index!=-1) {
        groups.insertBefore(groupnamediv, groups.children[index])
    } else {
        groups.appendChild(groupnamediv)
    }
    groupnamediv.addEventListener("click", function() {
        LoadPopUp(grouplist[value.trim()], value.trim())
      })
}

function AddTimeLimit(value, index) {
    var timelimittext = document.createElement('p')
    timelimittext.innerHTML = value
    timelimittext.classList.add('timelimit')
    var timelimitdiv = document.createElement('div')
    timelimitdiv.classList.add('item')
    timelimitdiv.appendChild(timelimittext)
    var timelimit = document.getElementById('timelimit')
    if (index!=-1) {
        timelimit.insertBefore(timelimitdiv, timelimit.children[index])
    } else {
        timelimit.appendChild(timelimitdiv)
    }    
}

function AddTimeLeft(value, index, urllist) {
    let diffarr = []
    //get website usage
    chrome.storage.local.get("websiteusage").then((results) => {
        dictionary = results["websiteusage"]
        console.log(dictionary)
        let x = 0
        let sum = 0
        // for all blocked
        while (x<urllist.length) {
            //if it is a category
            if (urllist[x] in categorylist) {
                
                // iteratibly values again
                let y = 0
                while (y<categorylist[urllist[x]].length) {
                    var entry = GetDictEntry(dictionary,categorylist[urllist[x]][y])
                    if (entry!=''){
                        let z = 0
                        while (z<entry.length){
                            sum = sum + CheckTime(entry[z])
                            z=z+1
                        }
                    }
                    y = y+1
                }
            } else {
                var entry = GetDictEntry(dictionary,urllist[x])
                if (entry!='') {
                    let z = 0
                        while (z<entry.length){
                            sum = sum + CheckTime(entry[z])
                            z=z+1
                        }
                }
            }
            x = x+1
        }
        diffarr = DifferenceOfTimes(value, sum)
        var timelefttext = document.createElement('p')
        if (diffarr!=[]) {
            timelefttext.innerHTML = String(diffarr[0]).padStart(2, '0') + ':' + String(diffarr[1]).padStart(2, '0') + ':' + String(diffarr[2]).padStart(2, '0');
        } else {
            timelefttext.innerHTML = "00:00:00"
        }
        timelefttext.classList.add('timeleft')
        var timeleftdiv = document.createElement('div')
        timeleftdiv.classList.add('item')
        timeleftdiv.appendChild(timelefttext)
        var timeleft = document.getElementById('timeleft')   
        if (index!=-1) {
            timeleft.insertBefore(timeleftdiv, timeleft.children[index])
        } else {
            timeleft.appendChild(timeleftdiv) 
        } 
    })  
}

function SaveChanges() {
    blocked=[]
    var groupnames = GetGroupNames()
    console.log(grouplist)
    var timelimits = GetTimeLimits()
    var timeleft = GetTimeLeft()
    x = 0
    while (x<groupnames.length) {
        if (groupnames[x].trim()!='' && timelimits[x].trim()!='' && timeleft[x].trim()!='') {
            blocked.push([groupnames[x], grouplist[groupnames[x].trim()], timelimits[x], timeleft[x]])
        }
        x = x + 1
    }
    chrome.storage.local.set({'blockedgroups': blocked})
    console.log(blocked)
}

function LoadState() {
        chrome.storage.local.get('blockedgroups').then((results) => {
            x = 0
            while (x<results['blockedgroups'].length) {
                var currenttitle = results['blockedgroups'][x][0]
                var listofurls = results['blockedgroups'][x][1]
                var currenttimelimit = results['blockedgroups'][x][2]
                var currenttimeleft = results['blockedgroups'][x][3]
                grouplist[currenttitle] = listofurls
                timelimitlist[currenttitle] = currenttimelimit
                AddGroupTitle(currenttitle)
                AddTimeLimit(currenttimelimit)
                AddTimeLeft(currenttimelimit,document.getElementsByClassName("groupname").length,listofurls)
                x = x+1
            }
            UpdateState()
        })     
}

async function UpdateState() {
    let i = 0
    while (i<1000) {
        chrome.storage.local.get('blockedgroups').then((results) => {
            x = 0
            console.log(results)
            while (x<results['blockedgroups'].length) {
                var currenttitle = results['blockedgroups'][x][0]
                var listofurls = results['blockedgroups'][x][1]
                var currenttimelimit = results['blockedgroups'][x][2]
                var groups = document.getElementsByClassName('groupname')
                var timelimits = document.getElementsByClassName('timelimit')
                var timelefts = document.getElementsByClassName('timeleft')
                index = -1
                x = 0
                while (x<groups.length) {
                    //go through all the groups on the page
                    //if the group names are equal, replace it, could ask if user wants to replace it.
                    //if the blockees are equal then replace it
                    if(groups[x].innerHTML.trim()==currenttitle.trim() || arrayEquals(grouplist[groups[x].innerHTML.trim()],listofurls) || timelimits[x].innerHTML.trim()==currenttimelimit.trim()) {
                        var index = Array.prototype.indexOf.call(groups[x].parentElement.parentElement.children, groups[x].parentElement);
                        groups[x].parentElement.parentElement.children[index].remove()
                        timelimits[x].parentElement.parentElement.children[index].remove()
                    }
                    x = x+1
                }
                grouplist[currenttitle] = listofurls
                timelimitlist[currenttitle] = currenttimelimit
                AddGroupTitle(currenttitle,index)
                AddTimeLimit(currenttimelimit,index)
                if (x==0) {
                    AddTimeLeftLazySolution(currenttimelimit,index,listofurls, true)
                } else {
                    AddTimeLeftLazySolution(currenttimelimit,index,listofurls, false)
                }
                x = x+1
            }
        })
        await sleep(1000)
        i=i+1
    }
}

function GetGroupNames() {
    var groups2 = document.getElementsByClassName('groupname')
    groupnames = []
    x = 0
    while (x<groups2.length) {
        groupnames.push(groups2[x].innerHTML)
        x = x + 1
    }
    return groupnames
}

function GetTimeLimits() {
    var timelimits = document.getElementsByClassName('timelimit')
    timelimitvalues = []
    x = 0
    while (x<timelimits.length) {
        timelimitvalues.push(timelimits[x].innerHTML)
        x = x + 1
    }
    return timelimitvalues
}

function GetTimeLeft() {
    var timeleft = document.getElementsByClassName('timeleft')
    timeleftvalues = []
    x = 0
    while (x<timeleft.length) {
        timeleftvalues.push(timeleft[x].innerHTML)
        x = x + 1
    }
    return timeleftvalues
}

function LoadPopUp(listofurls, grpname) {
    x=0
    while (x<listofurls.length) {
        AddGroupElement(listofurls[x])
        x = x + 1
    }
    document.getElementById('duration-input').value = timelimitlist[grpname]
    document.getElementById('groupname').value= grpname
    OpenPopup()
}

function AddCategories() {
    var categorybox = document.getElementById('option1display')
    var x = 0
    var keys = Object.keys(categorylist)
    while (x<keys.length) {
        var bigdiv = document.createElement('div')
        var remove = document.createElement('div')
        var categorynames = document.createElement('p')
        bigdiv.classList.add('blockeditemdiv2')
        remove.classList.add('remove')
        categorynames.innerText = keys[x]
        var catname = keys[x]
        bigdiv.appendChild(remove)
        bigdiv.appendChild(categorynames)
        bigdiv.addEventListener("click", function(bigdiv){
            AddGroupElement(catname)
        })
        categorybox.appendChild(bigdiv)
        x=x+1
    }
}

function arrayEquals(a, b) {
    //if both arrays
    if (Array.isArray(a)&&Array.isArray(b)) {
        //if both same length
        if (a.length === b.length) {
            //loop through arrays and check that the values are the same
            x=0
            duplicatecheck = true
            while (x<a.length) {
                if (!(b.includes(a[x]))) {
                    duplicatecheck = false
                }
                x=x+1
            }
            if (duplicatecheck==false){
                return false
            } else {
                return true
            }
        } else{
            return false
        }
    } else {
        return false
    }

  }



  function CheckTime(websitearray) {
    //sums up time spent on each website using the timestamp of the session
    var today = new Date();
    var test = 0
    test = Date.now()-(today.getHours()*3600*1000 + today.getMinutes()*60*1000 + today.getSeconds()*1000)
    let sum = 0
    let x = 0
    while (x<websitearray.length) {
        if (websitearray[x][0]>test) {
            sum = (sum + websitearray[x][1]-websitearray[x][0])
        }
        x = x+1
    }
    return sum/1000
}

function DifferenceOfTimes(value, sum) {
    var date1 = new Date('01/01/1970 ' + value);
    var days = Math.floor(sum/(3600*24))
    var hours = Math.floor((sum-days*(3600*24) )/ 3600);
    var minutes = Math.floor(((sum-hours*3600-days*(3600*24)) / 60))
    var seconds = Math.floor(sum-days*(3600*24)-3600*hours-60*minutes)
    var date2 = new Date('01/'+String(days+1).padStart(2,0)+'/1970 ' + hours.toString() + ':' + minutes.toString()+ ':' + seconds.toString())
    diff = (date1-date2)/1000
    hours = Math.floor(diff / 3600);
    minutes = Math.floor(((diff-hours*3600) / 60))
    seconds = Math.floor(diff-3600*hours-60*minutes)
    if (hours<0 || minutes<0 || seconds<0) {
        return [0,0,0]
    } else {
        return [hours,minutes,seconds]
    }
}

function GetDictEntry(dict, string) {
    let listofentries= []
    let keys = Object.keys(dict);
    let x = 0
    while (x<keys.length) {
        if (keys[x].includes(string)){
            listofentries.push(dict[keys[x]])
        } else {
        }
        x=x+1
      } 
    if (listofentries!=[]) {
        return listofentries
    } else {
        return ''   
    }

}

function AddTimeLeftLazySolution(value, index, urllist, truth) {
    let diffarr = []
    //get website usage
    chrome.storage.local.get("websiteusage").then((results) => {
        if (index!=-1) {
            var timelefts = document.getElementsByClassName('timeleft')
            timelefts[index].parentElement.parentElement.children[index].remove()
        }
        dictionary = results["websiteusage"]
        console.log(dictionary)
        let x = 0
        let sum = 0
        // for all blocked
        while (x<urllist.length) {
            //if it is a category
            if (urllist[x] in categorylist) {
                
                // iteratibly values again
                let y = 0
                while (y<categorylist[urllist[x]].length) {
                    var entry = GetDictEntry(dictionary,categorylist[urllist[x]][y])
                    if (entry!=''){
                        let z = 0
                        while (z<entry.length){
                            sum = sum + CheckTime(entry[z])
                            z=z+1
                        }
                    }
                    y = y+1
                }
            } else {
                var entry = GetDictEntry(dictionary,urllist[x])
                if (entry!='') {
                    let z = 0
                        while (z<entry.length){
                            sum = sum + CheckTime(entry[z])
                            z=z+1
                        }
                }
            }
            x = x+1
        }
        diffarr = DifferenceOfTimes(value, sum)
        var timelefttext = document.createElement('p')
        if (diffarr!=[]) {
            timelefttext.innerHTML = String(diffarr[0]).padStart(2, '0') + ':' + String(diffarr[1]).padStart(2, '0') + ':' + String(diffarr[2]).padStart(2, '0');
        } else {
            timelefttext.innerHTML = "00:00:00"
        }
        timelefttext.classList.add('timeleft')
        var timeleftdiv = document.createElement('div')
        timeleftdiv.classList.add('item')
        timeleftdiv.appendChild(timelefttext)
        var timeleft = document.getElementById('timeleft')   
        if (index!=-1) {
            timeleft.insertBefore(timeleftdiv, timeleft.children[index])
        } else {
            timeleft.appendChild(timeleftdiv) 
        } 
    })  
}