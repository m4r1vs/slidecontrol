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

import MiniBrowser from './classes/MiniBrowser'
import ClosedCaptions from './classes/ClosedCaptions'
import Laserpointer from './classes/Laserpointer'
import Watermark from './classes/Watermark'
import QRCodeWindow from './classes/QRCodeWindow'

export default class SlidecontrolEngine {

	constructor() {
		this.Connection = null
		this.presentationID = null
		this.qrCodeWindow = null

		this.start = this.start.bind(this)
		this.switchSlides = this.switchSlides.bind(this)
		this.simulateKeyPress = this.simulateKeyPress.bind(this)
		this.jumpSlides = this.jumpSlides.bind(this)
		this.handleNotification = this.handleNotification.bind(this)
		this.handleDeviceConnected = this.handleDeviceConnected.bind(this)
		this.handleDeviceDisconnected = this.handleDeviceDisconnected.bind(this)

		this.nextSlide = () => this.switchSlides('next')
		this.previousSlide = () => this.switchSlides('previous')
	}

	/**
	 * Start the slidecontrol engine,
	 * runs when server sends 'new-presentation-added' command
	 * @param {Object} Connection The connection that wants to run the engine
	 * @param {Number} presentationID The ID of our current session
	 */
	start(Connection, presentationID) {

		this.Connection = Connection
		this.presentationID = parseInt(presentationID)

		Logger.log(`Started Slidecontrol with id #${this.presentationID}`)

		// Initialize the other classes as well
		this.qrCodeWindow = new QRCodeWindow(presentationID)
		this.miniBrowser = new MiniBrowser()
		this.closedCaptions = new ClosedCaptions()
		this.laserpointer = new Laserpointer()
		this.watermark = new Watermark()

		// show notification with presentation's ID
		chrome.runtime.sendMessage("Your code for this presentation is " + presentationID)

		// get DOM elements needed to inject code and buttons
		const startButton = document.querySelector("#slidecontrol-start-block")
		const idContainer = document.querySelector("#slidecontrol-id-block")
		const idText = document.querySelector("#slidecontrol-id-text")
		const qrButtonContainer = document.querySelector("#slidecontrol-qr-button-block")
		const googleSlideButton = document.querySelector(".docs-material-menu-button-flat-default-caption")

		// hide the start button and show the ID
		startButton.style.display = "none"
		idContainer.style.display = "inline-block"
		idText.innerHTML = this.presentationID

		// watermark
		idContainer.addEventListener('click', () => this.watermark.toggle(presentationID))

		// add button for QR-Code
		qrButtonContainer.style.display = "inline-block"
		qrButtonContainer.addEventListener("click", () => this.qrCodeWindow.toggle())

		// detect change of slides
		const observer = new MutationObserver(() => {

			Logger.debug("Observed slide-change")

			// notify WebSocket of slide change
			this.Connection.send(JSON.stringify({
				command: "update-presentation",
				data: this.presentationData
			}))

		})

		// observe change of the button containing current slide number
		observer.observe(googleSlideButton, {
			attributes: true
		})
	}

	/**
	 * Returns information about the currently shown presentation
	 */
	get presentationData() {

		Logger.debug('Data about presentation requested...')

		// create script in google HTML
		let viewerDataScript = document.createElement("script")

		// make script put json from viewerData in "global" variable as body attribute
		viewerDataScript.textContent = "document.querySelector('body').setAttribute('viewerData', JSON.stringify(viewerData))"

		// place script
		document.body.appendChild(viewerDataScript)

		// get info now and remove script again
		const viewerData = JSON.parse(document.body.getAttribute("viewerData"))

		viewerDataScript.remove()
		document.body.removeAttribute("viewerData")

		const parseTitles = docDataArray => {
			let buffer = []
			docDataArray.forEach(slide => {
				buffer.push(slide[2] || `Slide Nr. ${slide[1] + 1}`)
			})
			return buffer
		}

		// parse information and return it
		const googleSlideButton = document.querySelector(".docs-material-menu-button-flat-default-caption") // Google button containing further info about slide
		const activeSlide = parseInt(googleSlideButton.getAttribute("aria-posinset")) // current Slide
		const totalSlides = parseInt(googleSlideButton.getAttribute("aria-setsize")) // total Slides
		const slidesTitles = parseTitles(viewerData.docData[1]) // get the titles of all slides as array
		const notes = viewerData.docData[1][activeSlide - 1][9] // notes as HTML
		const title = document.querySelector('[property="og:title"]').content // title of presentation
		
		return {
			notes,
			activeSlide,
			totalSlides,
			slidesTitles,
			notes,
			title
		}
	}

	/**
	 * switch the current slide (next or previous)
	 * @param {String} direction either "next" or "previous"
	 */
	switchSlides(direction) {

		Logger.debug("Switching slides in direction: " + direction)

		// depending on direction change mousewheel's direction to either up (-120) or down (120)
		const keyCode = direction === "next" ? 39 : 37
		const key = direction === "next" ? "ArrowRight" : "ArrowLeft"

		// create script which emits mousewheel event in given direction
		let script = document.createElement("script")
		script.textContent = "(" + function (keyCode, key) {
			document.dispatchEvent(new KeyboardEvent('keydown', {
				'key': key, 'keyCode': keyCode, 'code': key
			}))
		} + ')(' + keyCode + ',"' + key + '")'

		// place script and remove it right after :O
		document.body.appendChild(script)
		script.remove()
	}

	/**
	 * Simulate a keypress in slides
	 * @param {String} key The key to be pressed
	 * @param {Number} keyCode The keycode (also which)
	 * @param {String} code The code for the key to be pressed
	 */
	simulateKeyPress(key, keyCode, code) {

		Logger.debug("Pressing key: " + key)

		// Pass this to the function
		const keyMap = {
			key,
			keyCode,
			code
		}

		// Create script to emulate keydown
		let script = document.createElement("script")
		script.textContent = "(" + function (keyMap) {
			keyMap = JSON.parse(keyMap)
			document.dispatchEvent(new KeyboardEvent('keydown', {
				'key': keyMap.key, 'keyCode': keyMap.keyCode, 'code': keyMap.code
			}))
		} + ')(`' + JSON.stringify(keyMap) + '`)'

		// place script and remove it right after :O
		document.body.appendChild(script)
		script.remove()
	}

	/**
	 * Jump to a given slide
	 * @param {Number} slideNumber The slides number
	 */
	jumpSlides(slideNumber) {

		// loop through each digit and press the button
		[...slideNumber + ''].map(n => + n).forEach(digit => {
			this.simulateKeyPress(digit, 48 + digit, `Digit${digit}`)
		})

		// then press enter
		this.simulateKeyPress('Enter', 13, 'Enter')
	}

	/**
	 * The PWA sends 'notify-extension' command, then server redirects it back to us:
	 * @param {Object} notification The notification send from PWA over socket
	 */
	handleNotification(notification) {

		if (!notification) return

		// different known types of notification
		const typeMap = {
			"next-slide": this.nextSlide,
			"previous-slide": this.previousSlide,
			"toggle-webpage": () => this.miniBrowser.toggle(notification.url),
			"jump-slide": () => this.jumpSlides(notification.slideNumber),
			"show-closed-captions": () => this.closedCaptions.set(notification.cc),
			"laserpointer-down": () => this.laserpointer.show(),
			"laserpointer-move": () => this.laserpointer.move(notification.x, notification.y),
			"laserpointer-up": () => this.laserpointer.hide()
		}

		if (typeMap[notification.type]) typeMap[notification.type]()
	}

	/**
	 * Some controller sent 'add-new-controller' command with our ID to server
	 */
	handleDeviceConnected() {
		this.qrCodeWindow.hide()
		chrome.runtime.sendMessage("New device synced to presentation")
	}

	/**
	 * Some previusly synced controller disconnected from server
	 */
	handleDeviceDisconnected() {
		chrome.runtime.sendMessage("Device disconnected from presentation")
	}
}