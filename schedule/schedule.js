document.getElementById("closepopup").addEventListener("click",ClosePopup)
document.getElementById("addnew").addEventListener("click",OpenPopup)
document.getElementById("addwebsite").addEventListener("click", AddWebsiteSpecific)
document.getElementById("submitgroup").addEventListener("click",SubmitGroup)
document.getElementById("option1").addEventListener("click", ShowOption1)
document.getElementById("option2").addEventListener("click", ShowOption2)
document.getElementById('savechanges').addEventListener("click", SaveChanges)
document.getElementById('option1main').addEventListener("click", ShowGroups)
document.getElementById('option2main').addEventListener("click", ShowSchedule)

let draggableEl = document.getElementById("drag")
let draggable = new FullCalendar.Draggable(draggableEl,
    {
        eventData: {
            id:'a',
            title: 'my event',
            duration: '01:00'
          }
    });



const categorylist = {'social media' : ["instagram","twitter.com", "X.com", "facebook.com"]}
grouplist = {}

AddCategories()
LoadState()
function ClosePopup() {
    document.getElementById("popup").style.visibility='hidden';
    while (document.getElementById('groupelements').firstChild) {
        document.getElementById('groupelements').removeChild(document.getElementById('groupelements').lastChild);
    }
    document.getElementById('groupname').value = ''
}

function OpenPopup() {
    document.getElementById("popup").style.visibility='visible';
}

function ShowOption1() {
    document.getElementById("option2display").style.display = 'none'
    document.getElementById("option1display").style.display = 'flex'
}

function ShowOption2() {
    document.getElementById("option2display").style.display = 'flex'
    document.getElementById("option1display").style.display = 'none'
}

function ShowSchedule() {
    document.getElementById('listofwebsites').style.display='none'
    document.getElementById('calendarview').style.display='flex'
    LoadDraggables()
}

function ShowGroups() {
    document.getElementById('listofwebsites').style.display='flex'
    document.getElementById('calendarview').style.display='none'
    GetMenuTitles()
}

function AddCalendar(events) {
    let calendar;
        var calendarEl = document.getElementById('calendar');
        calendar = new FullCalendar.Calendar(calendarEl, {
            eventSources : [events],
            eventMouseEnter: function(info) {
                info.el.style.borderStyle = 'solid';
                info.el.style.borderColor = 'red';
            },
            eventMouseLeave: function(info) {
                info.el.style.borderColor = 'black';
            },
            eventClick: function(info) {
                info.event.remove()
              },
            initialView: 'timeGridWeek',
            dayHeaderFormat: {weekday: 'long'},
            firstDay: 1,
            slotDuration: '00:30:00',
            slotLabelFormat: {hours:1},
            dayHeaders: true,
            nowIndicator: false,
            slotLabelFormat: {
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: true,
                meridiem: 'short'
              },
            headerToolbar: {
                right: '',
                center: '',
                left:''
              },
              
            editable: true,
            height:"100%",
            droppable: true
        });
        $(calendarEl).data('fullCalendarObj',calendar);
        calendar.render()
        globalThis.CalendarInstance = $('#calendar').data('fullCalendarObj');
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
                // if there is a group name
                var websiteurls = document.getElementsByClassName("websitenamepop")

                var groupnamevalue = document.getElementById('groupname').value.trim()

                var groups = document.getElementsByClassName('groupname')

                //get all website urls
                while (x<document.getElementsByClassName("websitenamepop").length) {
                    urllist.push(websiteurls[x].innerHTML)
                    x = x+1
                }
                index = -1
                x = 0
                while (x<groups.length) {
                    if(groups[x].innerHTML.trim()==groupnamevalue.trim() || arrayEquals(grouplist[groups[x].innerHTML.trim()],urllist)) {
                        var index = Array.prototype.indexOf.call(groups[x].parentElement.parentElement.children, groups[x].parentElement);
                        groups[x].parentElement.parentElement.children[index].remove()
                    }
                    x = x+1
                }

                //reset groupname and add group name to table
                document.getElementsByClassName("websitenamepop").length!=0
                document.getElementById('groupname').value = ''
                AddGroupTitle(groupnamevalue, index)
                grouplist[groupnamevalue] = urllist

                //reset main div
                while (document.getElementById('groupelements').firstChild) {
                    document.getElementById('groupelements').removeChild(document.getElementById('groupelements').lastChild);
                }
        } else {
            //Throw error for not having set a group name
        }
    }
    ClosePopup()
}
   

AddCategories()


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

function AddGroupTitle(value, index) {
    var groupname = document.createElement('p')
    groupname.innerHTML = value
    groupname.classList.add('groupname')
    var groupnamediv = document.createElement('div')
    groupnamediv.classList.add('item')
    groupnamediv.classList.add('groupnamediv')
    groupnamediv.appendChild(groupname)
    let addnew = document.getElementById('addnew')
    var groups = document.getElementById('listofwebsites')
    if (index!=-1) {
        groups.insertBefore(groupnamediv, groups.children[index])
    } else {
        groups.insertBefore(groupnamediv,addnew)
    }
    groupnamediv.addEventListener("click", function() {
        LoadPopUp(grouplist[value.trim()], value.trim())
      })
}

function LoadPopUp(listofurls, grpname) {
    x=0
    while (x<listofurls.length) {
        AddGroupElement(listofurls[x])
        x = x + 1
    }
    document.getElementById('groupname').value= grpname
    OpenPopup()
}

function SaveChanges() {
    blocked=[]
    var groupnames = GetGroupNames()
    x = 0
    while (x<groupnames.length) {
        if (groupnames[x].trim()!='') {
            blocked.push([groupnames[x], grouplist[groupnames[x]]])
        }
        x = x + 1
    }
    let events = CalendarInstance.getEvents()
    let newevents = []
    for (let y in events) {
        newevents.push(CreateEventStorable(events[y]))
    }
    chrome.storage.local.set({'schedule': newevents})
    chrome.storage.local.set({'blockedgroupsschedule': blocked})
    console.log(newevents)
}

class Event {
    constructor(start,end,title) {
        this.start = start.toISOString();
        this.end = end.toISOString();
        this.title = title;
    }
}

function CreateEventStorable(event) {
    return new Event(event.start, event.end, event.title)
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

function LoadState() {
    chrome.storage.local.get('blockedgroupsschedule').then((results) => {
        x = 0
        while (x<results['blockedgroupsschedule'].length) {
            var currenttitle = results['blockedgroupsschedule'][x][0]
            var listofurls = results['blockedgroupsschedule'][x][1]
            grouplist[currenttitle] = listofurls
            AddGroupTitle(currenttitle, 0)
            x = x+1
        }
        LoadDraggables()
        chrome.storage.local.get('schedule').then((events) => {
            console.log(events)
            AddCalendar(events["schedule"])
        })
    })
}


function LoadDraggables() {
    // Load the titles of the draggable elements in the menu
    var groupnames = GetGroupNames()
    // Check if the group names have already been loaded into the menu
    var menutitles = GetMenuTitles()
    
    if (menutitles!=0) {
        groupnames = groupnames.filter( function( el ) {
            return menutitles.indexOf( el ) < 0;
          } );
    }
    if (groupnames!=[]) {
        for (let x in groupnames) {
            AddDraggableElement(groupnames[x])
        }
    }
}

function AddDraggableElement(groupname) {
    // adding each draggable element
    let menu = document.getElementById("draggableelements")
    let newDraggablediv = document.createElement('div')
    let newDraggableText = document.createElement('p')
    newDraggableText.classList.add('MenuTitle')
    newDraggableText.innerText = groupname
    newDraggablediv.appendChild(newDraggableText)
    menu.appendChild(newDraggablediv)
    new FullCalendar.Draggable(newDraggablediv,{
        eventData: {
            id:groupname,
            title: groupname,
            duration: '01:00'
          }
    })
}

function GetMenuTitles() {
    let menups = document.getElementsByClassName('MenuTitle')
    if (menups.length==0) {
        return 0
    } else {
        titles = []
        x = 0 
        while (x<menups.length) {
            titles.push(menups[x].innerText)
            x = x+1
        }
        return titles
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
            if (duplicatecheck==false){
                return false
            } else {
                return true
            }
            }
        } else{
            return false
        }
    } else {
        return false
    }

  }

