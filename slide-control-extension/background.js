chrome.runtime.onMessage.addListener(function(e) {
    if (e.from === "content" && e.subject === "notification") {
        let t = Math.floor(9e5 * Math.random()) + 1e5;
        chrome.notifications.create(t.toString(), {
            type: "basic",
            title: "slidecontrol",
            message: e.message,
            iconUrl: "./images/logo_128.png",
            priority: 0
        }, function() {})
    }
});