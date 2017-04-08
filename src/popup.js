// http://stackoverflow.com/questions/20019958/chrome-extension-how-to-send-data-from-content-script-to-popup-html

function toHHMMSS(seconds) {
    var sec_num = parseInt(seconds, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}

    var formattedValue = hours+':'+minutes+':'+seconds;
    if(formattedValue === 'NaN:NaN:NaN') {
        formattedValue =  'Error Occured';
    }

    return formattedValue;
}

function setDuration(response) {
    var formattedResponse = toHHMMSS(response.totalTime);
    document.getElementById('totalTime').innerHTML = formattedResponse;
    document.getElementById('lastReset').setAttribute('title', 'Total duration in hh:mm:ss format since '+ response.lastReset);
}

window.addEventListener('load', function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, {
                greeting: "getDetailsFromContent"
            },
            setDuration);
    });
})

document.getElementById('reset').addEventListener('click', function() {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id, {
                greeting: "resetDetailsFromContent"
            },
            setDuration);
    });
});
