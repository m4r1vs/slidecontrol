
// initialize firebase
var config = {
	apiKey: "AIzaSyCqS1FW46byte9poi87zoS1dGxy1nMlVZI",
	authDomain: "slide-control-firebase.firebaseapp.com",
	databaseURL: "https://slide-control-firebase.firebaseio.com",
	projectId: "slide-control-firebase",
	storageBucket: "slide-control-firebase.appspot.com",
	messagingSenderId: "377566080352"
};

firebase.initializeApp(config);
const db = firebase.firestore();
const presentations = db.collection("presentations");

// variables
let presentationInfo,
		presentationId,
		path = window.location.pathname;

// Logger for info and errors
const Logger = {
	log: log => console.log("[slidecontrol]", log),
	error: error => console.error("[slidecontrol error]", error)
};

/**
 * Generate ID for presentation
 */
const generateID = function () {
	
	// generate ID
	let id = Math.random() * 100000;
	id = Math.floor(id);
	Logger.log("Generated ID for slide: #" + id);

	// check that ID is not used by other presentation
	presentations.doc(id.toString()).get()
		.then(function (doc) {
			if (doc.exists) {
				generateID(); // if so, generate new one
			} else {
				Logger.log("Approved ID for slide: #" + id);
				presentationId = id;
			}
		})
		.catch(function (err) {
			alert("Oopsie Doopsie, slidecontrol failed connecting to the serva UwU");
		})
};

/**
 * Parse meta-information about presentation from google defined variable "viewerData"
 */
const getPresentationInfo = function () {

	Logger.log("getting Presentation Information...");
	
	// create script in google HTML
	let script = document.createElement("script");
	
	// make script put json from viewerData in "global" variable as body attribute
	script.textContent = "document.querySelector('body').setAttribute('viewerData', JSON.stringify(viewerData))";
	
	// place script
	document.body.appendChild(script);
	
	// get info now and remove script again
	presentationInfo = JSON.parse(document.body.getAttribute("viewerData"));
	script.remove();
	document.body.removeAttribute("viewerData");
}

/**
 * Initialize slidecontrol
 */
const init = function () {

	Logger.log("Initializing...");

	generateID();

	// create div to be put into the control-thingy in the presentation
	let googleSlideController = document.querySelector(".punch-viewer-nav-rounded-container");
	let slidecontrolProxy = document.createElement("div");

	slidecontrolProxy.className = "goog-inline-block goog-flat-button";
	slidecontrolProxy.style.margin = "0 4px";
	slidecontrolProxy.style.padding = "0";

	slidecontrolProxy.innerHTML = 	'<div class="goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block"></div>' + // the devider
									
									// start slidecontrol button
									'<div class="goog-inline-block goog-flat-button" id="slidecontrol-start-block">' +
										'<div class="punch-viewer-captioned-button" id="slidecontrol-start-button">' +
											'<div style="width:24px; height:24px;background-image:url(https://i.ibb.co/YPnSnLP/logo-ohnekontur-1.png);filter:grayscale(100);background-size:contain;background-position:center;background-repeat:no-repeat">' +
											'</div>' +
											'<div class="punch-viewer-speaker-notes-text goog-inline-block">' +
												'Start slidecontrol' +
											'</div>' +
										'</div>' + 
									'</div>' +
									
									// gets rendered after slidecontrol started
									'<div id="slidecontrol-id-block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; line-height: 16px; cursor: text;">' +
										'<div>Your ID:</div>' +
										'<div id="slidecontrol-id-text" style="font-size: 16px; font-weight: 600;" />' +
									'</div>';

	googleSlideController.appendChild(slidecontrolProxy);
	
	// get info about presentation
	getPresentationInfo();

	// user starts slidecontrol:
	document.querySelector("#slidecontrol-start-button").addEventListener("click", function () {

		Logger.log("Started Slidecontrol...");

		// show notification with slide ID
		chrome.runtime.sendMessage("Your code for this slide is " + presentationId.toString());

		let startButton = document.querySelector("#slidecontrol-start-block"),
				idContainer = document.querySelector("#slidecontrol-id-block"),
				idText = document.querySelector("#slidecontrol-id-text");

		// hide the start button and show the ID
		startButton.style.display = "none";
		idContainer.style.display = "inline-block";
		idText.innerHTML = presentationId.toString();

		let timestamp = new Date().getTime(),
				googleSlideButton = document.querySelector(".goog-flat-menu-button-caption"), // Google button containing further info about slide
				devicesConnected = 0, // in order to display "new device synced" notification
				position = parseInt(googleSlideButton.getAttribute("aria-posinset")), // current Slide
				totalSlides = parseInt(googleSlideButton.getAttribute("aria-setsize")), // total Slides
				notes = presentationInfo.docData[1][position - 1][9], // notes as HTML
				title = document.querySelector('[property="og:title"]').content; // title of presentation

		// in order to detect change of slides
		const observer = new MutationObserver(function () {

			Logger.log("Observed slide-change");

			// update position and notes in firestore
			position = parseInt(googleSlideButton.getAttribute("aria-posinset"));
			notes = presentationInfo.docData[1][position - 1][9];
			presentations.doc(presentationId.toString())
				.update({
					notes,
					position
				});

		});
		
		// observe change of the button containing current slide number
		observer.observe(googleSlideButton, {
			attributes: true
		});

		// Create new document in firestore with generated ID and input info
		presentations.doc(presentationId.toString())
			.set({
				command: "none", // changes when user switches slide in app
				devicesConnected, // increases when app connects to firestore
				timestamp, // only increases when update is to change slides
				totalSlides, // total slides to be displayed in app
				position, // currently displayed slide
				notes, // notes in HTML format
				title // title of presentation
			})
			.then(function () {

				// listen for changes in document after creation
				presentations.doc(presentationId.toString())
					.onSnapshot(function(doc) {

						Logger.log("Firestore got updated");

						// notify user when new device is listening for info
						if (devicesConnected < doc.data().devicesConnected) {
							chrome.runtime.sendMessage("New Device synced to slides #" + presentationId.toString());
						}

						// if timestamp changed to last update is is to change slides, so do so:
						if (timestamp !== doc.data().timestamp) {
							if (doc.data().command === "next") {
								switchSlide("next");
							}
							else if (doc.data().command === "back") {
								switchSlide("back");
							}
						}

						// update local information
						devicesConnected = doc.data().devicesConnected;
						timestamp = doc.data().timestamp;
					});
			})
			.catch(err => {
				Logger.error(err);
				alert("Damn, my code did a big oopsie. sorry 'bout that, dude(tte)");
			});
	});

}

/**
 * switch the current slide (next or previous)
 * @param {String} direction either "next" or "previous"
 */
const switchSlide = function (direction) {

	Logger.log("Switching slides in direction: " + direction);

	// depending on direction change mousewheel's direction to either up (-120) or down (120)
	const mousewheelDelta = direction === "next" ? -120 : 120;

	// create script which emits mousewheel event in given direction
	let script = document.createElement("script");
	script.textContent = "(" + function (mouseWheelDelta) {
		let googleSlideContainer = document.querySelector(".punch-viewer-container");
		let event = document.createEvent("Event");
		event.initEvent("mousewheel", true, false);
		event.wheelDelta = mouseWheelDelta;
		googleSlideContainer.dispatchEvent(event);
	} + ')("' + mousewheelDelta + '")';

	// place script and remove it right after :O
	document.body.appendChild(script);
	script.remove();
}

// only run all the stuff here if we are on an opened google slide
if (path.includes("/presentation/d/")) {

	Logger.log("Slidecontrol got evoked");

	const trimmedPath = path.replace("/presentation/d/", "");

	// we are in editing mode so create our lovely button
	if (trimmedPath.includes("/edit"))  {

		Logger.log("In edit-mode");

		// create stylesheet for button
		let stylesheet = document.createElement("style");
		stylesheet.innerHTML = 	"#slidecontrol-open-presentation-button {" +
															"text-decoration: none !important;}" +
														"#slidecontrol-open-presentation-button-text {" +
															"cursor: pointer;" +
															"background-image: none;" +
															"border-radius: 4px;" +
															"box-shadow: none;" +
															"box-sizing: border-box;" +
															"font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);" +
															"font-weight: var(--docs-material-font-weight-bold,500);" +
															"font-size: 14px;" +
															"height: 36px;" +
															"letter-spacing: 0.25px;" +
															"line-height: 16px;" +
															"background: white;" +
															"border: 1px solid #dadce0!important;" +
															"color: #202124;" +
															"padding: 9px 11px 10px 12px;}" +
														"#slidecontrol-open-presentation-button-text:hover {" +
															"border: 1px solid #feedbc!important;" +
															"background: #fffdf6;}";

		// place stylesheet
		document.head.appendChild(stylesheet);

		// get the google slides button and create new one
		let googleSlideController = document.querySelector(".punch-start-presentation-container"),
				openPresentationButton = document.createElement("a"),
				openPresentationButtonText = document.createElement("div");

		// initialize button to open presentation in new tab
		openPresentationButton.className = "punch-start-presentation-container";
		openPresentationButton.id = "slidecontrol-open-presentation-button";
		openPresentationButton.target = "_blank";
		openPresentationButton.href = window.location.href.replace("edit", "present");

		// add some google-made stylinng too
		openPresentationButtonText.className = "goog-inline-block jfk-button jfk-button-standard jfk-button-collapse-right docs-titlebar-button jfk-button-clear-outline";
		openPresentationButtonText.innerHTML = "slidecontrol";
		openPresentationButtonText.id = "slidecontrol-open-presentation-button-text";

		// place button
		openPresentationButton.appendChild(openPresentationButtonText);
		googleSlideController.before(openPresentationButton);

	}

	// we are in presentation mode, so initilize slidecontrol
	if (trimmedPath.includes("/present")) init(), Logger.log("In presentation-mode");
}