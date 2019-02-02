// recieve notification-instruction from content.js and display it
chrome.runtime.onMessage.addListener(function (notification) {
    chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: notification,
        iconUrl: "./images/logo_128.png"
    });
});