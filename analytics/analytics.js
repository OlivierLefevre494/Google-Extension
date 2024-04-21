

function LoadState() {
    chrome.storage.local.get('websiteusage').then((results)=> {
        console.log(Object.keys(results["websiteusage"]))
        let keys = Object.keys(results["websiteusage"])
        x = 0
        while (x<keys.length) {
            let timeandsesh = CheckTime(results["websiteusage"][keys[x]])
            console.log(keys[x])
            console.log(timeandsesh[0])
            console.log(timeandsesh[1])
            x = x+1
        }
    })
}
LoadState()


function CheckTime(websitearray) {
    let sum = 0
    let seshnum = websitearray.length
    let x = 0
    while (x<websitearray.length) {
        sum = sum + websitearray[x][1]-websitearray[x][0]
        x = x+1
    }
    return [sum,seshnum]
}