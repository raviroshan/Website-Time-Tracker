var startTime,
    endTime,
    diffInSeconds,
    diffInMinutes,
    previousDuration_String,
    previousDuration,
    host;

host = window.location.host;

function getDataFromStore(callback) {
    chrome.storage.sync.get("fbDuration", function(dbData) {
        // Check if user is using the extension for the first time
        if (dbData.fbDuration === undefined) {
            var obj = clearAllData();
            callback(obj);
        } else {
            // console.log('Data Fecthed from DB : ', dbData.fbDuration);
            if (dbData.fbDuration.totalTime == null || dbData.fbDuration.totalTime == "null" || dbData.fbDuration.totalTime === undefined) {
                dbData.fbDuration.totalTime = 0;
            } else {
                dbData.fbDuration.totalTime = parseFloat(parseFloat(dbData.fbDuration.totalTime).toFixed(2));
            }
            callback(dbData.fbDuration);
        }
    });
}

function storeData(diffInSeconds) {
    /*Retrive the previous duration from Chrome API Storage
    Convert that to Float
    Add the diffInSeconds
    Save the New Duration*/
    getDataFromStore(function(response) {
        // console.log('Previous Duration from DB : ' + response);
        response.totalTime = response.totalTime + diffInSeconds;
        //Store New Duration in Storage
        chrome.storage.sync.set({
            fbDuration: response
        });
        // console.log('New Duration Stored in DB ' + newDuration);
    });
}

function clearAllData() {
    var newDuration = 0;
    var current = new Date().toString();
    var obj = {
        totalTime: 0,
        lastReset: current
    };

    chrome.storage.sync.set({
        fbDuration: obj
    });

    return obj;
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting == "getDetailsFromContent") {
            var response = "Initial from content hahah";
            getDataFromStore(sendResponse);
            return true;
        } else if (request.greeting == "resetDetailsFromContent") {
            var response = "Reset Done from content hahaha";
            var obj = clearAllData();
            sendResponse(obj);
            return true;
        }
    }
);

startTime = new Date();
// console.log('Coming First Time on ' + host + ' at ' + startTime);

function tabFocus() {
    startTime = new Date();
    // console.log('Focusing back on ' + host + ' at ' + startTime);
}

function tabBlur() {
    endTime = new Date();
    // console.log('Quiting ' + host + ' at ' + endTime);

    diffInSeconds = (new Date(endTime) - new Date(startTime)) / 1000;
    // console.log('Recent Active Duration : ' + diffInSeconds + ' Seconds');

    storeData(diffInSeconds);
}


if (host === 'www.facebook.com') {
    window.addEventListener('focus', function() {
        tabFocus();
        // console.log('Focus Event Completed');
    });

    window.addEventListener('blur', function() {
        tabBlur();
        // console.log('Blur Event Completed');
    });

    window.onbeforeunload = function(e) {
        tabBlur();
        // console.log('onbeforeunload Completed');

        // var dialogText = 'Dialog text here';
        // e.returnValue = dialogText;
        // return dialogText;
    };
}
