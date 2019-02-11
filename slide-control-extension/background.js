// recieve notification-instruction from other scripts and display it
chrome.runtime.onMessage.addListener(notification => {
    chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: notification,
        iconUrl: "./images/logo_128.png"
    })
})

chrome.runtime.onInstalled.addListener(event => {
    
    // open welcome page in new tab when extension is installed
    if (event.reason === 'install') chrome.tabs.create({
        url: 'https://slidecontrol.niveri.xyz/welcome '
    })
    
    // show notification when extension is updated
    else if (event.reason === 'update') chrome.notifications.create({
        type: "basic",
        title: "slidcontrol",
        message: "Extension got updated to a new version!",
        iconUrl: "./images/logo_128.png"
    })
})