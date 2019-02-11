import QRCodeWindow from './classes/QRCodeWindow.js'
import Laserpointer from './classes/Laserpointer.js'

// variables
let path = window.location.pathname,
    Socket = null,
    laserpointer,
    qrcodewindow

// Logger for info and errors
const Logger = {
    log: log => console.log("[slidecontrol]", log),
    debug: log => DEV_MODE ? console.log("[slidecontrol debug]", log) : null,
    error: error => console.error("[slidecontrol error]", error)
}

/**
 * Parse meta-information about presentation from google defined variable "viewerData"
 */
const getPresentationInfo = () => {

    Logger.debug("Getting Presentation Information...")
    
    // create script in google HTML
    let viewerDataScript = document.createElement("script")
    
    // make script put json from viewerData in "global" variable as body attribute
    viewerDataScript.textContent = "document.querySelector('body').setAttribute('viewerData', JSON.stringify(viewerData))"
    
    // place script
    document.body.appendChild(viewerDataScript)
    
    // get info now and remove script again
    let viewerData = JSON.parse(document.body.getAttribute("viewerData"))
    
    viewerDataScript.remove()
    document.body.removeAttribute("viewerData")

    // parse information and return it
    let googleSlideButton = document.querySelector(".goog-flat-menu-button-caption"), // Google button containing further info about slide
        activeSlide = parseInt(googleSlideButton.getAttribute("aria-posinset")), // current Slide
        totalSlides = parseInt(googleSlideButton.getAttribute("aria-setsize")), // total Slides
        notes = viewerData.docData[1][activeSlide - 1][9], // notes as HTML
        title = document.querySelector('[property="og:title"]').content // title of presentation

    return {
        notes,
        activeSlide,
        totalSlides,
        notes,
        title
    }
}

/**
 * Register presentation to WebSocket with generated ID
 */
const registerPresentation = () => {

    // generate random code
    let presentationID = Math.floor(Math.random() * 100000)

    // check quality of code
    if (!presentationID) registerPresentation()
    if (isNaN(presentationID)) registerPresentation()
    if (presentationID < 1000 || presentationID > 99999) registerPresentation()
    
    Logger.log("Generated ID for slide: #" + presentationID)

    // query information about presentation and send it
    Socket.send(JSON.stringify({
        reason: 'new-slide',
        code: presentationID,
        ...getPresentationInfo()
    }))
}

/**
 * switch the current slide (next or previous)
 * @param {String} direction either "next" or "previous"
 */
const switchSlide = function (direction) {

    Logger.debug("Switching slides in direction: " + direction)

    // depending on direction change mousewheel's direction to either up (-120) or down (120)
    const mousewheelDelta = direction === "next" ? -120 : 120

    // create script which emits mousewheel event in given direction
    let script = document.createElement("script")
    script.textContent = "(" + function (mouseWheelDelta) {
        let googleSlideContainer = document.querySelector(".punch-viewer-container")
        let event = document.createEvent("Event")
        event.initEvent("mousewheel", true, false)
        event.wheelDelta = mouseWheelDelta
        googleSlideContainer.dispatchEvent(event)
    } + ')("' + mousewheelDelta + '")'

    // place script and remove it right after :O
    document.body.appendChild(script)
    script.remove()
}

/**
 * Runs whenever message from server is recieved
 * @param {Object} message message from server
 */
const handleMessage = message => {

    Logger.debug('recieved message: ' + message.reason)
    if (!message || !message.reason) return

    const map = {
        "error-slide-code-taken": () => registerPresentation(),
        "slide-created": () => startSlidecontrol(message.code),
        "next-slide": () => switchSlide("next"),
        "previous-slide": () => switchSlide("previous"),
        "new-device-synced": () => {
            qrcodewindow.hide()
            chrome.runtime.sendMessage("New device synced to slide: #" + message.code)
        },
        "laserpointer-down": () => laserpointer.show(),
        "laserpointer-move": () => laserpointer.move(message.x, message.y),
        "laserpointer-up": () => laserpointer.hide()
    }

    if (map[message.reason]) map[message.reason]()
}

/**
 * Add button to start slidecontrol (when presentation is opened is present-mode)
 */
const main = () => {

    Logger.debug("Adding slidecontrol button...")

    // create div to be put into the control-thingy in the presentation
    let googleSlideController = document.querySelector(".punch-viewer-nav-rounded-container")
    let slidecontrolProxy = document.createElement("div")

    slidecontrolProxy.className = "goog-inline-block goog-flat-button"
    slidecontrolProxy.style.margin = "0 4px"
    slidecontrolProxy.style.padding = "0"

    slidecontrolProxy.innerHTML = `
        <div class="goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block"></div>

        <div class="goog-inline-block goog-flat-button" id="slidecontrol-start-block">
            <div class="punch-viewer-captioned-button" id="slidecontrol-start-button">
                <div style="width:24px; height:24px; background-image:url(https://i.ibb.co/YPnSnLP/logo-ohnekontur-1.png); filter:grayscale(100); background-size:contain; background-position:center; background-repeat:no-repeat;">
                </div>
                <div class="punch-viewer-speaker-notes-text goog-inline-block">
                    Start slidecontrol
                </div>
            </div> 
        </div>
        
        <div id="slidecontrol-id-block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; line-height: 16px; cursor: text;">
            <div>Your ID:</div>
            <div id="slidecontrol-id-text" style="font-size: 16px; font-weight: 600;"></div>
        </div>

        <div id="slidecontrol-qr-button-block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; cursor: pointer; line-height: 28px; cursor: text;">
            <div style="cursor: pointer;font-size: 14px;font-weight: 700;">QR-CODE</div>
        </div>
    `

    googleSlideController.appendChild(slidecontrolProxy)

    // user starts slidecontrol:
    document.querySelector("#slidecontrol-start-button").addEventListener("click", initializeSlidecontrol)

}

/**
 * Initiate slidecontrol,
 * runs when "start Slidecontrol" button is pressed
 */
const initializeSlidecontrol = () => {

    Logger.log('Initializing slidecontrol...')

    // get user chosen server from storage and connect
    chrome.storage.sync.get({
        websocketIP: 'wss://www.maniyt.de:61263'
    }, settings => {

        Logger.log('Connecting to socket on server: ' + settings.websocketIP)
        Socket = new WebSocket(settings.websocketIP)
    
        Socket.onopen = () => {
            registerPresentation()
            Socket.onmessage = message => handleMessage(JSON.parse(message.data))
        }
    
        Socket.onerror = error => {
            Logger.error(error)
            alert(`Error connecting to slidecontrol server ${settings.websocketIP}. Maybe change servers at sc.niveri.xyz/settings`)
        }
    })

}

/**
 * Runs when server sends "slide-created" message,
 * meaning it knows we exist and app can connect too
 * @param {Number} presentationID the ID of current presentation
 */
const startSlidecontrol = presentationID => {

    Logger.log("Started Slidecontrol with id #" + presentationID)

    // *pew* *pew* *pewww*
    laserpointer = new Laserpointer(Logger)
    
    // The QR that opens when user click 'QR-Code' button
    qrcodewindow = new QRCodeWindow(presentationID)

    // show notification with presentation's ID
    chrome.runtime.sendMessage("Your code for this presentation is " + presentationID)

    // get DOM elements needed to inject code and buttons
    let startButton = document.querySelector("#slidecontrol-start-block"),
        idContainer = document.querySelector("#slidecontrol-id-block"),
        idText = document.querySelector("#slidecontrol-id-text"),
        qrButtonContainer = document.querySelector("#slidecontrol-qr-button-block")

    // hide the start button and show the ID
    startButton.style.display = "none"
    idContainer.style.display = "inline-block"
    idText.innerHTML = presentationID

    // add button for QR-Code
    qrButtonContainer.style.display = "inline-block"
    qrButtonContainer.addEventListener("click", () => qrcodewindow.toggle())

    // Google button containing further info about slide
    let googleSlideButton = document.querySelector(".goog-flat-menu-button-caption")

    // detect change of slides
    const observer = new MutationObserver(() => {

        Logger.debug("Observed slide-change")
        
        // notify WebSocket of slide change
        Socket.send(JSON.stringify({
            reason: "slide-changed",
            ...getPresentationInfo()
        }))

    })
    
    // observe change of the button containing current slide number
    observer.observe(googleSlideButton, {
        attributes: true
    })
}

// only run all the stuff here if we are on an opened google slide
if (path.includes("/presentation/d/")) {

    Logger.debug("Slidecontrol got evoked")

    const trimmedPath = path.replace("/presentation/d/", "")

    // we are in editing mode so create our lovely button
    if (trimmedPath.includes("/edit"))  {

        Logger.debug("In edit-mode")

        // create stylesheet for button
        let stylesheet = document.createElement("style")
        stylesheet.innerHTML = `
            #slidecontrol-open-presentation-button {
                text-decoration: none !important
            }
            #slidecontrol-open-presentation-button-text {
                cursor: pointer;
                background-image: none;
                border-radius: 4px;
                box-shadow: none;
                box-sizing: border-box;
                font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);
                font-weight: var(--docs-material-font-weight-bold,500);
                font-size: 14px;
                height: 36px;
                letter-spacing: 0.25px;
                line-height: 16px;
                background: white;
                border: 1px solid #dadce0!important;
                color: #202124;
                padding: 9px 11px 10px 12px
            }
            #slidecontrol-open-presentation-button-text:hover {
                border: 1px solid #feedbc!important;
                background: #fffdf6
            }
        `

        // place stylesheet
        document.head.appendChild(stylesheet)

        // get the google slides button and create new one
        let googleSlideController = document.querySelector(".punch-start-presentation-container"),
                openPresentationButton = document.createElement("a"),
                openPresentationButtonText = document.createElement("div")

        // initialize button to open presentation in new tab
        openPresentationButton.className = "punch-start-presentation-container"
        openPresentationButton.id = "slidecontrol-open-presentation-button"
        openPresentationButton.target = "_blank"
        openPresentationButton.href = window.location.href.replace("edit", "present")

        // add some google-made stylinng too
        openPresentationButtonText.className = "goog-inline-block jfk-button jfk-button-standard jfk-button-collapse-right docs-titlebar-button jfk-button-clear-outline"
        openPresentationButtonText.innerHTML = "slidecontrol"
        openPresentationButtonText.id = "slidecontrol-open-presentation-button-text"

        // place button
        openPresentationButton.appendChild(openPresentationButtonText)
        googleSlideController.before(openPresentationButton)

    }

    // we are in presentation mode, so initilize slidecontrol
    if (trimmedPath.includes("/present")) {

        Logger.debug("In presentation-mode")

        // adds the "start slidecontrol" button and runs initializeSlidecontrol() on click
        main()
    }
}