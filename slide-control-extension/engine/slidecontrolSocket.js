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

import SlidecontrolEngine from './slidecontrolEngine'

export default class SlidecontrolSocket {

	constructor() {
		this.Connection = null
		this.slidecontrolEngine = null

		this.connect = this.connect.bind(this)
		this.handleMessage = this.handleMessage.bind(this)
		this.registerPresentation = this.registerPresentation.bind(this)
	}

	/**
	 * Connect to server chosen in options
	 * Runs when user clicks 'start slidecontrol' button
	 */
	connect() {
		
		// Now that we are connecting, already initialize the engine
		this.slidecontrolEngine = new SlidecontrolEngine()

		// get user chosen server from storage and connect
		chrome.storage.sync.get({
			backendIP: 'wss://www.maniyt.de:61263'
		}, settings => {

			Logger.log('Connecting to socket on server: ' + settings.backendIP)

			this.Connection = new WebSocket(settings.backendIP)

			this.Connection.onopen = () => {

				// register current presentation to server, also get ID
				this.registerPresentation()

				// let handle run whenever new message is recieved
				this.Connection.onmessage = message => this.handleMessage(JSON.parse(message.data))
			}

			this.Connection.onerror = error => {
				Logger.error(error)
				alert(`Error connecting to slidecontrol server ${settings.backendIP}. Maybe change servers at sc.niveri.de/settings`)
			}
		})
	}

	/**
	 * Runs whenever message from server is recieved
	 * @param {Object} message message from server
	 */
	handleMessage(message) {

		Logger.debug('Recieved message: ' + message.command)

		// if no message (or command) sent, dont do shit
		if (!message) return
		if (!message.command) return
		if (!this.Connection) return

		// All recievable commands from server
		const commandMap = {
			"new-presentation-added": () => this.slidecontrolEngine.start(this.Connection, parseInt(message.data.presentationID)),
			"notify-extension": () => this.slidecontrolEngine.handleNotification(message.data),
			"new-controller-synced": this.slidecontrolEngine.handleDeviceConnected,
			"controller-disconnected": this.slidecontrolEngine.handleDeviceDisconnected
		}

		// check if recieved command valid:
		if (commandMap[message.command]) commandMap[message.command]()
	}

	/**
	 * Send information about current presentation and slide to server
	 * It then answers with 'new-presentation-added' and generated ID
	 */
	registerPresentation() {

		if (!this.Connection) return

		this.Connection.send(JSON.stringify({
			command: 'add-new-presentation',
			data: this.slidecontrolEngine.presentationData
		}))
	}
}