chrome.extension.onMessage.addListener(function(request, sender, sendResponseToPopup) {
    if (request.greeting === "getDetails") {
        var response = "Initial Load Value";
        sendResponseToPopup(response);
    } else if (request.greeting === "resetDetails") {
        var response = "Reset Done from background";
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                greeting: "resetDetailsFromContent"
            }, function(response) {
                console.log(response);
                sendResponseToPopup('dude');
                // chrome.tabs.create({
                //     "url": 'http://www.raviroshan.info/'
                // });
            });
        });
        return true;
    }
});
