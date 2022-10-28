/**
 * Slidecontrol - The open-source remote control solution
 * Copyright (C) 2019 Marius Niveri <marius.niveri@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.
 *
 * If not, see <https://www.gnu.org/licenses/>.
 */

// the main logic is in /engine/
import SlidecontrolSocket from './engine/slidecontrolSocket'

// Logger for info and errors
window.Logger = {
	log: log => console.log("[slidecontrol]", log),
	debug: log => DEV_MODE ? console.log("[slidecontrol debug]", log) : null,
	error: error => console.error("[slidecontrol error]", error)
}

const slidecontrolSocket = new SlidecontrolSocket()

// variables
const PATH = window.location.pathname

/**
 * Add button to start slidecontrol (when presentation is opened is present-mode)
 */
const initializePresentation = () => {

	Logger.debug("Adding slidecontrol button...")

	// create div to be put into the control-thingy in the presentation
	const googleSlideController = document.querySelector(".punch-viewer-navbar")
	const slidecontrolProxy = document.createElement("div")

	slidecontrolProxy.className = "goog-inline-block goog-flat-button"
	slidecontrolProxy.style.margin = "0 4px"
	slidecontrolProxy.style.padding = "0"

	slidecontrolProxy.innerHTML = `
		<div class="goog-toolbar-separator goog-toolbar-separator-disabled goog-inline-block"></div>

		<div class="goog-inline-block goog-flat-button" id="slidecontrol-start-block">
			<div class="punch-viewer-captioned-button" id="slidecontrol-start-button">
				<div style="width:24px; height:24px; background-image:url(https://slidecontrol.niveri.de/assets/logo_ohnekontur.png); filter:grayscale(100); background-size:contain; background-position:center; background-repeat:no-repeat;">
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

	googleSlideController.childNodes[0].appendChild(slidecontrolProxy)

	// user starts slidecontrol, we connect to server:
	document.querySelector("#slidecontrol-start-button").addEventListener("click", slidecontrolSocket.connect)
}

/**
 * Add button to open presentation with slidecontrol
 */
const addSlidecontrolButton = () => {

	// create stylesheet for button
	const stylesheet = document.createElement("style")

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
	const googleSlideController = document.querySelector(".punch-start-presentation-container")
	const openPresentationButton = document.createElement("a")
	const openPresentationButtonText = document.createElement("div")

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

// only run all the stuff here if we are on an opened google slide
if (PATH.includes("/presentation/d/")) {

	Logger.debug("Slidecontrol got evoked")

	const trimmedPath = PATH.replace("/presentation/d/", "")

	// we are in editing mode so create our lovely button
	if (trimmedPath.includes("/edit"))  {

		Logger.debug("In edit-mode")

		// adds button to open presentation with slidecontrol
		addSlidecontrolButton()
	}

	// we are in presentation mode, so initilize slidecontrol
	if (trimmedPath.includes("/present")) {

		Logger.debug("In presentation-mode")

		// prevent Computer from falling asleep during presentation
		try {
			ComputerSleep.prevent()
			Logger.debug("Preventing computer from falling asleep...")
		} catch (error) {
			Logger.error("Couldn't prevent computer from falling asleep :/")
		}

		// adds the "start slidecontrol" button and connects on click
		initializePresentation()
	}
}