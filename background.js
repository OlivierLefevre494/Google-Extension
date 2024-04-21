chrome.runtime.onInstalled.addListener(({reason}) => {
    if (reason === 'install') {
        chrome.storage.local.set({"blockingstatus" : 0})
        chrome.storage.local.set({"numofblocks" : 0})
        chrome.storage.local.set({"blocked" : []})
        var date = Date.now()
        chrome.storage.local.set({"websiteusage": {}})
        chrome.storage.local.set({"blockedgroups" : []})
        chrome.tabs.create({
            url: "onboarding.html"
        });
    }
});
var date = Date.now()
chrome.storage.local.set({"active": ''})
var list = [];
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
                        console.log(results["blocked"])
                        for (let y in results["blocked"]) {
                            if (Array.isArray(results["blocked"][y])) {
                                for (let z in results["blocked"][y][1]) {
                                    if (tabs[x].url.includes(results["blocked"][y][1][z])) {
                                        blocked=true;
                                        console.log(true)
                                    }
                                }
                            } else {
                                if (tabs[x].url.includes(results["blocked"][y])) {
                                    console.log(results["blocked"][y])
                                    console.log(tabs[x].url)
                                    console.log(true)
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

     async function LoopThrough(newactive, currentdictionary,starttime) {
        //adds new session which is interval of 2 dates
        if (newactive in currentdictionary) {
            //if website already exists add new session
            currentdictionary[newactive].push([starttime, starttime])
        } else {
            // if website doesn't exist yet add new session
            currentdictionary[newactive]=[[starttime,starttime]]
        }
        while (active==newactive) {
            //while this tab is active, change the end time of the session by 1 s every second and update the dictionary
            currentdictionary[newactive][currentdictionary[newactive].length-1][1] = currentdictionary[newactive][currentdictionary[newactive].length-1][1] + 1000 
            chrome.storage.local.set({"websiteusage": currentdictionary})
            console.log(currentdictionary)
            await sleep(1000)
        }
    }

const sleep = ms => new Promise(r => setTimeout(r, ms));


let active = ''
//On change of active tab
chrome.tabs.onActivated.addListener((results) => {
    chrome.tabs.get(results['tabId']).then((answers)=>{
        //get tab id and url
        var tabId = results['tabId']
        var url = answers["url"]
        var time = Date.now()
        if (CheckForLimited(url, currentdictionary)) {
            //set new active url, update time on each website
                active = url
                chrome.storage.local.set({"active": url})
                LoopThrough(url, currentdictionary, time)
        }
    })
})


function CheckForLimited(url,currentdictionary) {
    if (url in currentdictionary) {
        console.log(currentdictionary)
        console.log(CheckTime(currentdictionary[url]))
    }
    return true
}

function CheckTime(websitearray) {
    //sums up time spent on each website using the timestamp of the session
    let sum = 0
    let x = 0
    while (x<websitearray.length) {
        sum = sum + websitearray[x][1]-websitearray[x][0]
        x = x+1
    }
    return sum
}