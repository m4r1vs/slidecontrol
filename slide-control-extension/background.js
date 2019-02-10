// recieve notification-instruction from content.js and display it
chrome.runtime.onMessage.addListener(function (notification) {
    chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: notification,
        iconUrl: "./images/logo_128.png"
    })
})

chrome.runtime.onInstalled.addListener(function (event) {
    if (event.reason === 'install') chrome.tabs.create({ url: 'https://slidecontrol.niveri.xyz/welcome ' })
    else if (event.reason === 'update') chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: "Extension got updated to new version!",
        iconUrl: "./images/logo_128.png"
    })
})