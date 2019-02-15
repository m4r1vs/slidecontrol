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

const generatePresentationID = require('./generatePresentationID')
const sendData = require('./sendData')

module.exports = class SlidecontrolEngine {

	/**
	 * State of the Engine
	 */
	constructor() {
		this.presentations = {}
	}

	/**
	 * Run either removePresentation() or removeController()
	 * @param {Object} connection Closed Connection
	 */
	closeConnection(connection) {
		if (connection.__type__ === 'presentation') this.removePresentation(connection)
		else if (connection.__type__ === 'controller') this.removeController(connection)
	}

	/**
	 * Remove presentation from list of presentations and close all connected controller
	 * @param {Object} connection The closed connection
	 */
	removePresentation(connection) {
		if (!connection.__presentationID__) return
		if (!this.presentations[connection.__presentationID__]) return

		// gracefully close all connected controller
		this.presentations[connection.__presentationID__].controller.forEach(controller => {
			controller.terminate()
		})
		this.presentations[connection.__presentationID__] = null

		Logger.debug('Removed Presentationw with ID:', connection.__presentationID__)
	}

	/**
	 * Remove controller from connected presentation and notify it
	 * @param {Object} connection The closed connection
	 */
	removeController(connection) {
		if (!connection.__presentationID__) return
		if (!this.presentations[connection.__presentationID__]) return

		sendData(this.presentations[connection.__presentationID__].connection, {
			command: 'controller-disconnected'
		})

		const index = this.presentations[connection.__presentationID__].controller.indexOf(connection)
		if (index >= 0) {
			this.presentations[connection.__presentationID__].controller.splice(index, 1)
		}

		Logger.debug('Removed Controller with ID:', connection.__presentationID__)
	}

	/**
	 * Add a presentation!
	 * @param {Object} data The presentations data that is kept until connection is closed
	 * @param {Object} connection The connection of the to-be-added presentation
	 */
	addNewPresentation(data, connection) {
		Logger.debug('Running addNewPresentation() with data:', data)

		// check if already added
		if (connection.__presentationID__) return

		// generate [package.json/presentationIDlength] digit ID for presentation
		const presentationID = generatePresentationID(this.presentations, parseInt(CONFIG.presentationIDlength) || 5)

		Logger.debug('Adding new presentation with ID:', presentationID)

		// pollute connection itself with ID and meta info
		connection.__presentationID__ = presentationID
		connection.__type__ = 'presentation'

		// add presentation to list
		this.presentations[presentationID] = {
			connection,
			data,
			controller: []
		}

		// send generated ID back to extension
		sendData(connection, {
			command: 'new-presentation-added',
			data: {
				presentationID
			}
		})
	}

	/**
	 * Update data about presentation on server and notify all connected controller
	 * @param {Object} data The updated data
	 * @param {Object} connection The connection to the updating extension
	 */
	updatePresentation(data, connection) {
		Logger.debug('Running updatePresentation() with data:', data)

		const presentationID = connection.__presentationID__

		// check if it is a presentation and if it is valid
		if (connection.__type__ !== 'presentation') return
		if (!presentationID) return
		if (!this.presentations[presentationID]) return

		// update the data on server
		this.presentations[presentationID].data = data

		this.presentations[presentationID].controller.forEach(controller => {
			sendData(controller, {
				command: 'presentation-updated',
				data
			})
		})
	}

	/**
	 * Check if given ID is taken or not
	 * @param {Object} data.presentationID The ID to be checked
	 * @param {Object} connection The connection checking the ID
	 */
	checkPresentationID(data, connection) {
		Logger.debug('Running checkPresentationID() with data:', data)

		if (!data) return
		if (!data.presentationID) return

		sendData(connection, {
			command: (this.presentations[data.presentationID]) ? 'presentation-id-ok' : 'presentation-id-unknown'
		})
	}

	/**
	 * Add a new controller to presentation with given ID
	 * @param {Objext} data.presentationID The ID of the controller to be added
	 * @param {Object} connection The connection of the controller wanting to be added
	 */
	addNewController(data, connection) {
		Logger.debug('Running addNewController() with data:', data)

		if (!data) return
		if (!data.presentationID) return
		if (connection.__presentationID__) return
		if (!this.presentations[data.presentationID]) return sendData(connection, {
			command: 'presentation-id-unknown'
		})

		connection.__presentationID__ = data.presentationID
		connection.__type__ = 'controller'
		this.presentations[data.presentationID].controller.push(connection)

		sendData(this.presentations[data.presentationID].connection, {
			command: 'new-controller-synced'
		})

		sendData(connection, {
			command: 'new-controller-added',
			data: this.presentations[data.presentationID].data
		})
	}

	/**
	 * Notify the connected extension of the given data
	 * @param {Object} data The data the extension should know aboot
	 * @param {Object} connection The connection notifying the extension
	 */
	notifyExtension(data, connection) {
		Logger.debug('Running notifyExtension() with data:', data)

		if (!data) return
		if (!connection.__presentationID__) return
		if (connection.__type__ !== 'controller') return
		if (!this.presentations[connection.__presentationID__]) return

		sendData(this.presentations[connection.__presentationID__].connection, {
			command: 'notify-extension',
			data
		})
	}
}