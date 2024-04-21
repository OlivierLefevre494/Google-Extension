console.log("Hello world");
document.getElementById("OpenSettings").addEventListener("click", opensettings);
function opensettings() {
    chrome.tabs.create({
        url: "blocksites/blocksites.html"
    });
}