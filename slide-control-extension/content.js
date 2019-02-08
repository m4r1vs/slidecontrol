// variables
let path = window.location.pathname,
		Socket = null,
		laserpointer,
		qrcodewindow

// Logger for info and errors
const Logger = {
	log: log => console.log("[slidecontrol]", log),
	error: error => console.error("[slidecontrol error]", error)
}

/**
 * Parse meta-information about presentation from google defined variable "viewerData"
 */
const getPresentationInfo = function () {

	Logger.log("getting Presentation Information...")
	
	// create script in google HTML
	let script = document.createElement("script")
	
	// make script put json from viewerData in "global" variable as body attribute
	script.textContent = "document.querySelector('body').setAttribute('viewerData', JSON.stringify(viewerData))"
	
	// place script
	document.body.appendChild(script)
	
	// get info now and remove script again
	let viewerData = JSON.parse(document.body.getAttribute("viewerData"))

	script.remove()
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
 * Register slide to server
 */
const registerSlide = () => {

	// generate random code
	let code = Math.floor(Math.random() * 100000)

	// check quality of code
	if (!code) registerSlide()
	if (isNaN(code)) registerSlide()
	if (code < 1000 || code > 99999) registerSlide()
	
	Logger.log("Generated ID for slide: #" + code)

	// query information about presentation and send it
	Socket.send(JSON.stringify({
		reason: 'new-slide',
		code,
		...getPresentationInfo()
	}))
}

class QRCodeWindow {

	constructor(code) {

		this.element = document.createElement("div")
		this.background = document.createElement("div")

		this.element.id = "qr-code-window"
		this.background.id = "qr-code-window-background"

		this.element.style = `
			position: fixed;
			z-index: 10;
			border-radius: 28px;
			opacity: 0;
			display: none;
			padding: 32px;
			transition: opacity .32s;
			top: calc(35vh - (272px / 2) - 32px);
			left: calc(50vw - (272px / 2) - 32px);
			width: 272px;
			height: 272px;
			background: #212121;
		`

		this.background.style = `
			position: fixed;
			opacity: 0;
			transition: opacity .32s;
			z-index: 9;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #000;
			display: none;
		`

		this.background.addEventListener("click", this.hide.bind(this))

		new QRCode(this.element, {
			text: `slide-control-firebase.firebaseapp.com/controller/${code}`,
			height: 272,
			width: 272,
			colorDark: '#ffbc16',
			colorLight: '#212121',
			correctLevel: QRCode.CorrectLevel.H
		})

		document.body.insertBefore(this.element, document.body.firstChild)
		document.body.insertBefore(this.background, document.body.firstChild)
	}

	toggle() {
		(this.element.style.display === "none") ? this.show() : this.hide()
	}

	show() {
		if (this.element.style.display === "block") return

		this.element.style.display = "block"
		this.background.style.display = "block"

		setTimeout(() => {
			this.element.style.opacity = 1
			this.background.style.opacity = 0.618
		}, 20);

		console.log("show")
	}

	hide() {
		if (this.element.style.display === "none") return

		this.element.style.opacity = "0"
		this.background.style.opacity = "0"

		setTimeout(() => {
			this.element.style.display = "none"
			this.background.style.display = "none"
		}, 320);

		console.log("hide")
	}
}
class Laserpointer {

	constructor() {
		
		Logger.log("created laserpointer")
		Logger.log("muhahahahahahahaaa")

		this.element = document.createElement("div")
		
		this.element.id = "laserpointer"
		this.element.style = `
			position: relative;
			width: 14px;
			height: 14px;
			transition: opacity, transform .45s;
			background: red;
			border-radius: 7px;
			border-top-left-radius: 0;
			box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, .87);
			z-index: 5;
			bottom: 100px;
			left: 100px;
		`
		
		this.slideWrapper = document.querySelector(".punch-viewer-content")
		this.slideWrapper.insertBefore(this.element, this.slideWrapper.firstChild)

		this.x = 100,
		this.y = 100,
		this._x = 0,
		this._y = 0
	}

	show() {

		window.requestAnimationFrame(() => {
			this.element.style.opacity = "1"
			this.element.style.transform = "scale(8)"
			setTimeout(() => {
				this.element.style.transform = "scale(1)"
			}, 150);
		})
	}

	move(x, y) {

		window.requestAnimationFrame(() => {
			// cant got out of bounds
			if ((this.x + x) < 0) this.x = 0
			if ((this.y + y) < 0) this.y = 0
			if ((this.x + x) > parseInt(this.slideWrapper.style.width)) this.x = parseInt(this.slideWrapper.style.width)
			if ((this.y + y) > parseInt(this.slideWrapper.style.height)) this.y = parseInt(this.slideWrapper.style.height)
	
			this.element.style.left = `${this.x + x * 3}px`
			this.element.style.top = `${this.y + y * 3}px`
	
			this._x = x * 3
			this._y = y * 3
		})

	}

	hide() {

		window.requestAnimationFrame(() => {
			this.x = this.x + this._x
			this.y = this.y + this._y
			this.element.style.opacity = "0.3"
		})

	}
}

/**
 * Runs whenever message from server is recieved
 * @param {Object} message message from server
 */
const handleMessage = message => {
	Logger.log('recieved message: ' + message.reason)
	if (!message || !message.reason) return

	const map = {
		"error-slide-code-taken": () => registerSlide(),
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
 * Add button to start slidecontrol
 */
const main = function () {

	Logger.log("Adding slidecontrol button...")

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

// Initialize slidecontrol and connect to serva
const initializeSlidecontrol = () => {
	console.log('Initializing slidecontrol...')

	Socket = new WebSocket('wss://www.maniyt.de:61263')

	Socket.onopen = () => {
		registerSlide()
		Socket.onmessage = message => handleMessage(JSON.parse(message.data))
	}

	Socket.onerror = error => {
		console.error(error)
		alert("Error in slidecontrol: socket-error-connection")
		location.reload()
	}
}

// yap, finally we can have some fun:
const startSlidecontrol = code => {
	Logger.log("Started Slidecontrol with id #" + code)

	// *pew* *pew* *pewww*
	laserpointer = new Laserpointer()
	
	qrcodewindow = new QRCodeWindow(code)

	// show notification with slide ID
	chrome.runtime.sendMessage("Your code for this slide is " + code)

	let startButton = document.querySelector("#slidecontrol-start-block"),
		idContainer = document.querySelector("#slidecontrol-id-block"),
		idText = document.querySelector("#slidecontrol-id-text"),
		qrButtonContainer = document.querySelector("#slidecontrol-qr-button-block")

	// hide the start button and show the ID
	startButton.style.display = "none"
	idContainer.style.display = "inline-block"
	idText.innerHTML = code

	qrButtonContainer.style.display = "inline-block"
	qrButtonContainer.addEventListener("click", () => qrcodewindow.toggle())

	// Google button containing further info about slide
	let googleSlideButton = document.querySelector(".goog-flat-menu-button-caption")

	// in order to detect change of slides
	const observer = new MutationObserver(() => {

		Logger.log("Observed slide-change")
		
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

/**
 * switch the current slide (next or previous)
 * @param {String} direction either "next" or "previous"
 */
const switchSlide = function (direction) {

	Logger.log("Switching slides in direction: " + direction)

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

// only run all the stuff here if we are on an opened google slide
if (path.includes("/presentation/d/")) {

	Logger.log("Slidecontrol got evoked, mothafucka")

	const trimmedPath = path.replace("/presentation/d/", "")

	// we are in editing mode so create our lovely button
	if (trimmedPath.includes("/edit"))  {

		Logger.log("In edit-mode")

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
		Logger.log("In presentation-mode")
		main()
	}
}