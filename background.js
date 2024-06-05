chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.storage.local.set({"blockingstatus" : 0})
        chrome.storage.local.set({"numofblocks" : 0})
        chrome.storage.local.set({"blocked" : []})
        var date = Date.now()
        chrome.storage.local.set({"websiteusage": {}})
        chrome.storage.local.set({"schedule" : ''})
        chrome.storage.local.set({"blockedgroups" : []})
        chrome.storage.local.set({"blockedgroupsschedule" : []})
        chrome.storage.local.set({"audible" : []})
        chrome.tabs.create({
            url: "onboarding.html"
        });
    }
});
var date = Date.now()
chrome.storage.local.set({"active": []})
var list = [];
chrome.storage.local.set({"blockedgroups" : []})
let currentdictionary = {}
chrome.storage.local.get("websiteusage").then((results) => {
    currentdictionary = results["websiteusage"]
})
  chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
        if (changeInfo.status == 'complete') {
            chrome.tabs.query({status: "complete"}, function(tabs){
                for (let x in tabs){
                    var blocked = false
                    chrome.storage.local.get("blocked").then((results) => {
                        for (let y in results["blocked"]) {
                            if (Array.isArray(results["blocked"][y])) {
                                for (let z in results["blocked"][y][1]) {
                                    if (tabs[x].url.includes(results["blocked"][y][1][z])) {
                                        blocked=true;
                                    }
                                }
                            } else {
                                if (tabs[x].url.includes(results["blocked"][y])) {
                                    blocked=true;
                                }
                            }
                        }
                        if (blocked==true){
                            list.push(tabs[x].id)
                            console.log(tabs[x].id)
                            chrome.scripting.executeScript({
                                target: {tabId: tabs[x].id},
                                files:  ["removebody.js"]
                            }).then(() => console.log("script injected"))
                            blocked= false;
                        }
                        
                    })
                }
            })
        };       
    })

    
    async function getCurrentTab() {
        let queryOptions = { active: true, lastFocusedWindow: true };
        // `tab` will either be a `tabs.Tab` instance or `undefined`.
        let [tab] = await chrome.tabs.query(queryOptions);
        return tab;
      }

     async function LoopThrough(newactive,starttime) {
        await sleep(100)
        //adds new session which is interval of 2 dates
        if (newactive in currentdictionary) {
            //if website already exists add new session
            currentdictionary[newactive].push([starttime, starttime])
        } else {
            // if website doesn't exist yet add new session
            currentdictionary[newactive]=[[starttime,starttime]]
        }
        while (active.includes(newactive)) {
            //while this tab is active, change the end time of the session by 1 s every second and update the dictionary
            currentdictionary[newactive][currentdictionary[newactive].length-1][1] = currentdictionary[newactive][currentdictionary[newactive].length-1][1] + 1000 
            chrome.storage.local.set({"websiteusage": currentdictionary})
            await sleep(1000)
        }
    }

    async function BackgroundLoopThrough(newbackground, currentdictionary,starttime) {
        await sleep(1000)
        if (newbackground in currentdictionary) {
            //if website already exists add new session
            currentdictionary[newbackground].push([starttime, starttime, 'b'])
        } else {
            // if website doesn't exist yet add new session
            currentdictionary[newbackground]=[[starttime,starttime, 'b']]
        }
        while (audible.includes(newbackground)) {
            //while this tab is active, change the end time of the session by 1 s every second and update the dictionary
            currentdictionary[newbackground][currentdictionary[newbackground].length-1][1] = currentdictionary[newbackground][currentdictionary[newbackground].length-1][1] + 1000 
            chrome.storage.local.set({"websiteusage": currentdictionary})
            await sleep(1000)
        }

    }

const sleep = ms => new Promise(r => setTimeout(r, ms));


//On change of active tab
//chrome.tabs.onActivated.addListener((results) => {
//    chrome.tabs.get(results['tabId']).then((answers)=>{
//       //get tab id and url
 //       var tabId = results['tabId']
 //       var url = answers["url"]
  //      var time = Date.now()
 //       console.log(url)
  //      if (true) {
            //set new active url, update time on each website
  //              active = url
  //              chrome.storage.local.set({"active": url})
  //              LoopThrough(url, currentdictionary, time)
  //      }
  //  })
//})

let audible = []
async function AudibleTabs() {
    let i = 0
    while (i<1000000000000000) {
        chrome.tabs.query({audible:true}, function(tabs) {
            chrome.storage.local.get("blockedgroups").then((results)=> {
                let blocked = CheckTimeLimits(results["blockedgroups"])
                let audible2 = []
                var time = Date.now()
                for (let x in tabs) {
                    Redirect(tabs[x]["url"],currentblockeds,tabs[x].id)
                    CheckForBlocked(tabs[x]["url"], blocked, tabs[x].id)
                    if (tabs[x].active == false) {
                        if (!audible.includes(tabs[x])) {
                            BackgroundLoopThrough(tabs[x].url, currentdictionary, time)
                        }
                        audible2.push(tabs[x].url)
                    }
                }
                audible=audible2
                chrome.storage.local.set({"audible": audible})
        })
    })
        await sleep(1000)
        i=i+1
    }
}

AudibleTabs()
let active = []
async function ActiveTab() {
    let i = 0
    while (i<1000000000000000) {
        chrome.tabs.query({active:true}, function(tabs) {
            chrome.storage.local.get("blockedgroups").then((results)=> {
            let blocked = CheckTimeLimits(results["blockedgroups"])
            let active2 = []
            var time = Date.now()
            for (let x in tabs) {
                Redirect(tabs[x]["url"],currentblockeds,tabs[x].id)
                CheckForBlocked(tabs[x]["url"], blocked, tabs[x].id)
                active2.push(tabs[x]["url"])
                if (!active.includes(tabs[x]["url"])) {
                    LoopThrough(tabs[x]["url"], time)
                }
            }
            active=active2
            chrome.storage.local.set({"active": active})
             i=i+1
            })
            })
        await sleep(1000)

    }
}
ActiveTab()

function Redirect(a,b,c){
    for (let x in b) {
        if (a.includes(b[x])) {
            chrome.scripting.executeScript({
                target: {tabId:c},
                files:  ["removebody.js"]
            }).then(() => console.log("script injected"))
        }
    }
}

function CheckForBlocked(url, blocked, tabId) {
    for (let x in blocked) {
        for (let o in blocked[x][1]) {
            if (Array.isArray(blocked[x][1][o])) {
                for (let z in blocked[x][1][o]) {
                    if (url.includes(blocked[x][1][o][z])) {
                        chrome.scripting.executeScript({
                            target: {tabId:tabId},
                            files:  ["removebody.js"]
                        }).then(() => console.log("script injected"))
                    }
                }
            } else {
                if (url.includes(blocked[x][1][o])) {
                    chrome.scripting.executeScript({
                        target: {tabId:tabId},
                        files:  ["removebody.js"]
                    }).then(() => console.log("script injected"))
                }
            }
        }
    }
}

function CheckForLimited(url,currentdictionary) {
    if (url in currentdictionary) {
    }
    return true
}




function CheckTimeLimits(groups) {
    // given the groups of time limited websites
    let blockedgroups=[]
    let x = 0
    // go through all groups that are under the form [name, timelimit, website array]
    while (x<groups.length) {
        let sum = 0
        for (let o in groups[x][1]) {
            if (Array.isArray(groups[x][1][o])) {
                //if an element of the group is a list (like a category) then go through each one
                let y = 0
                while (y<groups[x][1][o].length) {
                    let a = GetDictEntry(currentdictionary, groups[x][1][o][y])
                    if (a!=[] && a!="") {
                        let z = 0
                        while (z<a.length) {
                            sum = sum + CheckTime(a[z])
                            z=z+1
                        }
                    }
                    y=y+1
                }
            } else {
                // else get all the website arrays that contain the given string
                let a = GetDictEntry(currentdictionary, groups[x][1][o])
                if (a!=[] && a!="") {
                        let z = 0
                        while (z<a.length) {
                            sum = sum + CheckTime(a[z])
                            z=z+1
                        }
                }
            }
        }
        let diff = DifferenceOfTimes(groups[x][2],sum)
        if (arrayEquals(diff, [0,0,0])) {
            blockedgroups.push(groups[x])
        }
        x=x+1
    }
    return blockedgroups
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
    let diff = (date1-date2)/1000
    hours = Math.floor(diff / 3600);
    minutes = Math.floor(((diff-hours*3600) / 60))
    seconds = Math.floor(diff-3600*hours-60*minutes)
    if (hours<0 || minutes<0 || seconds<0) {
        return [0,0,0]
    } else {
        return [hours,minutes,seconds]
    }
}

function arrayEquals(a, b) {
    //if both arrays
    if (Array.isArray(a)&&Array.isArray(b)) {
        //if both same length
        if (a.length === b.length) {
            //loop through arrays and check that the values are the same
            let x=0
            let duplicatecheck = true
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
  let currentblockedt = []
  let currentblockeds = []
  async function ScheduleCheck() {
    let x = 0
    while (x < 1000000000000000) {
        await sleep(1000)
        chrome.storage.local.get("blockedgroupsschedule").then((results) => {
            chrome.storage.local.get("schedule").then((schedule) => {
                let r = CheckForSchedule(currentblockedt, results["blockedgroupsschedule"], schedule["schedule"])
                currentblockedt = r[0]
                currentblockeds = r[1]
            })
        })
        x = x+1
    }
  }
 ScheduleCheck()

  function CheckForSchedule(currentblockedt,blockedgroupsschedule, schedule) {
    let blocked = []
    let currenttime = Date.now()
    // Date.parse(isoDate) to turn ISO format dates Nov whatever into ms since 1970
    for (let x in schedule) {
        if (CompareTime(schedule[x], currenttime)) {
            blocked.push(schedule[x].title)
        }
    }
    let sitelist = []
    for (let y in blockedgroupsschedule) {
        // for each array of a group title and group of websites e.g ['social media', ['instagram.com', 'facebook.com']]
        if (blocked.includes(blockedgroupsschedule[y][0])) {
            //if it is blocked
            for (let z in blockedgroupsschedule[y][1]) {
                if (Array.isArray(blockedgroupsschedule[y][1][z])) {
                    for (let g in blockedgroupsschedule[y][1][z]) {
                        sitelist.push(blockedgroupsschedule[y][1][z][g])
                    }
                } else {
                    sitelist.push(blockedgroupsschedule[y][1][z])
                }
            }
        }
    }
    if (!arrayEquals(blocked,currentblockedt)) {
        return [blocked,sitelist]
    } else {
        return [currentblockedt,sitelist]
    }

  }

  function CompareTime(object, current) {
    // Note, object has object.start and object.end in ISO string format
    // current has a date from Date.now in ms since 1970 Jan 1st midnight
    let cdateobj = new Date(current)
    let sdateobj = new Date(object.start)
    let edateobj = new Date(object.end)
    if (cdateobj.getDay()==sdateobj.getDay() && sdateobj.getHours()<=cdateobj.getHours()<=edateobj.getHours()) {
        if (sdateobj.getHours()==cdateobj.getHours() && sdateobj.getMinutes()<=cdateobj.getMinutes()) {
            return true
        }
        if (edateobj.getHours()==cdateobj.getHours() && edateobj.getMinutes()>=cdateobj.getMinutes()) {
            return true
        }
        if (sdateobj.getHours()<cdateobj.getHours() && cdateobj.getHours()<edateobj.getHours()) {
            return true
        }
        return false
    } else {
        return false
    }
  }