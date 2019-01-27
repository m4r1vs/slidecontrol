const path = window.location.pathname;
let firstPath;

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

let presentationId;
let activeSlide = 0;

const spawnId = function () {
	let id = Math.random() * 100000;
	id = Math.floor(id);

	presentations.doc(id.toString()).get()
		.then(function (doc) {
			if (doc.exists) {
				spawnId();
			} else {
				presentationId = id;
			}
		})
		.catch(function (err) {
			alert("Error in Slidecontrol (#021)");
		})
}

spawnId();

const initListener = function (id) {

}

const parseBody = function () {
	const script = document.createElement("script");
	script.id = "tmpScript";
	let scriptContent = "document.querySelector('body').setAttribute('viewerData', JSON.stringify(viewerData))";
	script.appendChild(document.createTextNode(scriptContent));
	(document.body || document.head || document.documentElement).appendChild(script);
	let r = JSON.parse(document.querySelector("body").getAttribute("viewerData"));
	document.querySelector("#tmpScript").remove();
	document.querySelector("body").removeAttribute("viewerData");
}

const init = function () {
	let punchContainer = document.querySelector(".punch-viewer-nav-rounded-container");
	let div = document.createElement("div");

	div.className = "goog-inline-block goog-flat-button";
	div.style.margin = "0 4px";
	div.style.padding = "0";


	div.innerHTML = '<div class="goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block"></div>' +

									'<div class="goog-inline-block goog-flat-button" id="sc_show_id_container">' +
										'<div class="punch-viewer-captioned-button" id="sc_show_id">' +
											'<div style="width:24px; height:24px;background-image:url(https://i.ibb.co/YPnSnLP/logo-ohnekontur-1.png);filter:grayscale(100);background-size:contain;background-position:center;background-repeat:no-repeat">' +
											'</div>' +
											'<div class="punch-viewer-speaker-notes-text goog-inline-block">' +
												'Start slidecontrol' +
											'</div>' +
										'</div>' + 
									'</div>' +

									'<div id="sc_id_block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; line-height: 16px;">' +
										'<div>Your ID:</div>' +
										'<div id="sc_id_container" style="font-size: 16px; font-weight: 600;">' +
											'******' +
										'</div>' +
									'</div>' +

									'<div class="goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block"></div>' +

									'<div class="goog-inline-block goog-flat-button" style="text-align: center; font-size: 11px; line-height: 16px;">' +
										'get slidecontrol:' +
										'<br>' +
										'<a id="sc_app_url" style="font-size: 14px; color: #e3e3e3; text-decoration: none; font-weight: 500;" href="https://slides.limhenry.xyz" target="_blank">' +
											'slidecontrol.com' +
										'</a>' +
									'</div>';

	punchContainer.appendChild(div);
	
	activeSlide = parseInt(document.querySelector(".goog-flat-menu-button-caption").getAttribute("aria-posinset"));

	document.querySelector("#sc_show_id").addEventListener("click", function () {

		chrome.runtime.sendMessage({
			from: "content",
			subject: "notification",
			message: "Your code for this slide is " + presentationId.toString()
		})

		let startButton = document.querySelector("#sc_show_id_container");
		let idContainer = document.querySelector("#sc_id_block");
		let idText = document.querySelector("#sc_id_container");

		startButton.style.display = "none";
		idContainer.style.display = "inline-block";
		idText.innerHTML = presentationId.toString();

		let timestamp = new Date().getTime();
		let devicesConnected = 0;

		presentations.doc(presentationId.toString())
			.set({
				command: "none",
				devicesConnected,
				timestamp 
			})
			.then(function () {
				presentations.doc(presentationId.toString())
					.onSnapshot(function(doc) {

						if (devicesConnected < doc.data().devicesConnected) {
							chrome.runtime.sendMessage({
								from: "content",
								subject: "notification",
								message: "New Device synced to slides #" + presentationId.toString()
							})
						}

						if (timestamp !== doc.data().timestamp) {
							if (doc.data().command === "next") {
								switchSlide("next");
							}
							else if (doc.data().command === "back") {
								switchSlide("back");
							}
						}

						devicesConnected = doc.data().devicesConnected;
						timestamp = doc.data().timestamp;
					});
			});
	});

}

/**
 * switch the current slide (next or previous)
 * @param {String} direction either "next" or "previous"
 */
const switchSlide = function (direction) {
	const way = direction === "next" ? -10 : 50;
	let script = document.createElement("script");

	script.textContent = "(" + function(e) {
		let punchContainer = document.querySelector(".punch-viewer-container");
		let event = document.createEvent("Events");

		event.initEvent("mousewheel", true, false);
		event.wheelDelta = e;
		punchContainer.dispatchEvent(event);
	} + ')("' + way + '")';

	(document.head || document.documentElement).appendChild(script);
	script.parentElement.removeChild(script);
	activeSlide = parseInt(document.querySelector(".goog-flat-menu-button-caption").getAttribute("aria-posinset"));
}

if (path.includes("/presentation/d/")) {

	const t = path.replace("/presentation/d/", "");

	t.includes("/edit") && function() {
		let elem = document.createElement("style");

		elem.innerHTML = "#sc_present_with_remote_container:hover {box-shadow: none!important;}#sc_present_with_remote {background-image: none;border-radius: 4px;box-shadow: none;box-sizing: border-box;font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);font-weight: var(--docs-material-font-weight-bold,500);font-size: 14px;height: 36px;letter-spacing: 0.25px;line-height: 16px;background: white;border: 2px solid grey!important;color: #202124;padding: 9px 11px 10px 12px;cursor: pointer;transition: all 150ms ease;}#sc_present_with_remote:hover {border: 2px solid yellow!important;background-color: #fffdf6;}";
		(document.head || document.documentElement).appendChild(elem);

		let punchContainer = document.querySelector(".punch-start-presentation-container");
		let anchor = document.createElement("a");
		let div = document.createElement("div");

		anchor.className = "punch-start-presentation-container";
		anchor.id = "sc_present_with_remote_container";
		anchor.style.textDecoration = "none";
		anchor.target = "_blank";
		anchor.href = window.location.href.replace("edit", "present");
		div.className = "goog-inline-block jfk-button jfk-button-standard jfk-button-collapse-right docs-titlebar-button jfk-button-clear-outline";
		div.innerHTML = "slidecontrol";
		div.id = "sc_present_with_remote";
		anchor.appendChild(div);
		punchContainer.before(anchor);

	}();

	t.includes("/present") && (init(), firstPath = t.split("/")[0])
}