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
	div.innerHTML = '<div class=\'goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block\'></div><div class="goog-inline-block goog-flat-button">    <div class="punch-viewer-captioned-button" id="rfgs_show_id">        <div style="width:24px; height:24px">            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"                style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">                <path fill="none" d="M0 0h24v24H0V0z"/>                <path d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27                 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66                 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>            </svg>        </div>        <div class="punch-viewer-speaker-notes-text goog-inline-block">Start slidecontrol</div>    </div></div><div id="rfgs_id_block" class="goog-inline-block goog-flat-button" style="display: none; text-align: center; line-height: 16px;">    <div>Slide ID:</div>    <div id="rfgs_id_container" style="font-size: 16px; font-weight: 600;">******</div></div><div class="goog-inline-block goog-flat-button"     style="text-align: center; font-size: 11px; line-height: 16px;">get slidecontrol:<br>    <a id="rfgs_app_url" style="font-size: 14px; color: #e3e3e3; text-decoration: none; font-weight: 500;" href="https://slides.limhenry.xyz" target="_blank">slidecontrol.com</a></div><div class=\'goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block\' id=\'rfgs_divider\' style=\'display: none\'></div><div class="goog-inline-block goog-flat-button" id="rfgs_refresh_id_container" style="display: none">    <div class="punch-viewer-captioned-button" id="rfgs_refresh_id">        <div style="width:24px; height:24px">            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"                style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">                <path fill="none" d="M0 0h24v24H0V0z"/>                <path d="M17.65 6.35c-1.63-1.63-3.94-2.57-6.48-2.31-3.67.37-6.69 3.35-7.1 7.02C3.52                 15.91 7.27 20 12 20c3.19 0 5.93-1.87 7.21-4.56.32-.67-.16-1.44-.9-1.44-.37                 0-.72.2-.88.53-1.13 2.43-3.84 3.97-6.8 3.31-2.22-.49-4.01-2.3-4.48-4.52C5.31 9.44                 8.26 6 12 6c1.66 0 3.14.69 4.22 1.78l-1.51 1.51c-.63.63-.19 1.71.7 1.71H19c.55 0                 1-.45 1-1V6.41c0-.89-1.08-1.34-1.71-.71l-.64.65z"/>            </svg>        </div>        <div class="punch-viewer-speaker-notes-text goog-inline-block">Refresh ID</div>    </div></div><div class="goog-inline-block goog-flat-button" id="rfgs_stop_remote_container" style="display: none">    <div class="punch-viewer-captioned-button" id="rfgs_stop_remote">        <div style="width:24px; height:24px">            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"                style="pointer-events: none; display: block; width: 100%; height: 100%; fill: #cacaca;">                <path fill="none" d="M0 0h24v24H0V0z"/>                <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41                     0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39                     1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41                     12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>            </svg>        </div>        <div class="punch-viewer-speaker-notes-text goog-inline-block">Stop Remote</div>    </div></div>\n    ';
	punchContainer.appendChild(div);
	
	document.querySelector("#rfgs_refresh_id").addEventListener("click", function () {
		alert("clicked")
	});

	activeSlide = parseInt(document.querySelector(".goog-flat-menu-button-caption").getAttribute("aria-posinset"));

	document.querySelector("#rfgs_show_id").addEventListener("click", function () {

		let viewerText = document.querySelector("#rfgs_show_id .punch-viewer-speaker-notes-text");
		let idContainer = document.querySelector("#rfgs_id_container");

		viewerText.innerHTML = "ID";
		document.querySelector("#rfgs_stop_remote_container").style.display = "inline-block";
		idContainer.style.letterSpacing = "0px";
		idContainer.innerHTML = presentationId.toString();

		presentations.doc(presentationId.toString())
			.set({
				activeSlide: activeSlide
			})
			.then(function () {
				presentations.doc(presentationId.toString())
					.onSnapshot(function(doc) {
						if (doc.data().activeSlide > activeSlide) {
							while (doc.data().activeSlide > activeSlide) {
								switchSlide("next");
							}
						}
						else if (doc.data().activeSlide < activeSlide) {
							while (doc.data().activeSlide < activeSlide) {
								switchSlide("back");
							}
						}
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

		elem.innerHTML = "#rfgs_present_with_remote_container:hover {box-shadow: none!important;}#rfgs_present_with_remote {background-image: none;border-radius: 4px;box-shadow: none;box-sizing: border-box;font-family: var(--docs-material-header-font-family,Roboto,RobotoDraft,Helvetica,Arial,sans-serif);font-weight: var(--docs-material-font-weight-bold,500);font-size: 14px;height: 36px;letter-spacing: 0.25px;line-height: 16px;background: white;border: 2px solid grey!important;color: #202124;padding: 9px 11px 10px 12px;cursor: pointer;transition: all 150ms ease;}#rfgs_present_with_remote:hover {border: 2px solid yellow!important;background-color: #fffdf6;}";
		(document.head || document.documentElement).appendChild(elem);

		let punchContainer = document.querySelector(".punch-start-presentation-container");
		let anchor = document.createElement("a");
		let div = document.createElement("div");

		anchor.className = "punch-start-presentation-container";
		anchor.id = "rfgs_present_with_remote_container";
		anchor.style.textDecoration = "none";
		anchor.target = "_blank";
		anchor.href = window.location.href.replace("edit", "present");
		div.className = "goog-inline-block jfk-button jfk-button-standard jfk-button-collapse-right docs-titlebar-button jfk-button-clear-outline";
		div.innerHTML = "slidecontrol";
		div.id = "rfgs_present_with_remote";
		anchor.appendChild(div);
		punchContainer.before(anchor);

	}();

	t.includes("/present") && (init(), firstPath = t.split("/")[0])
}