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

const ConnectionGuardian = require('./engine/connectionGuardian')
const decodeRawMessage = require('./engine/decodeRawMessage')
const SlidecontrolEngine = require('./engine/slidecontrolEngine')
const StatsGuardian = require('./engine/statsGuardian')

const slidecontrolEngine = new SlidecontrolEngine()
const connectionGuardian = new ConnectionGuardian()
const statsGuardian = new StatsGuardian()

module.exports = class SlidecontrolServer {

	constructor() {

		// public functions
		this.handleNewConnection = this.handleNewConnection.bind(this)
		this.handleClose = this.handleClose.bind(this)
		this.handleMessage = this.handleMessage.bind(this)
	}

	/**
	 * Close all connections gracefully and clean after close
	 * @param {Object} connection The closed connection
	 * @param {Object} request The requester for the closed connection
	 */
	handleClose(connection, request) {
		Logger.log(`Connection closed from IP: ${request.connection.remoteAddress}`)

		// Descrease connections for the guard
		connectionGuardian.decreaseConnections()

		// also remove controller/presentation from engine
		slidecontrolEngine.closeConnection(connection)
	}

	/**
	 * Handle new messages and map them for the engine
	 * @param {Object} message The decoded message sent
	 * @param {Object} connection The connection that sent the message
	 */
	handleMessage(message, connection) {

		// if no message (or command) sent, dont do shit
		if (!message) return
		if (!message.command) return
		if (!message.data) return

		Logger.debug('New valid message recieved: ', message)

		// All recievable commands
		const commandMap = {

			// from extension:
			'add-new-presentation': () => {
				slidecontrolEngine.addNewPresentation(message.data, connection)
				statsGuardian.increaseStat('presentationsCreated', 1)
			},
			'update-presentation': () => {
				slidecontrolEngine.updatePresentation(message.data, connection)
				statsGuardian.increaseStat('slidesUpdated', 1)
			},
			
			// from PWA/home:
			'check-presentation-id': () => slidecontrolEngine.checkPresentationID(message.data, connection),

			// from PWA/controller:
			'add-new-controller': () => slidecontrolEngine.addNewController(message.data, connection),
			'notify-extension': () => slidecontrolEngine.notifyExtension(message.data, connection)
		}

		// check if recieved command valid:
		if (commandMap[message.command]) commandMap[message.command]()
		else Logger.error('Sent command not valid: ', message)
	}
	
	/**
	 * Add event listeners to new connection, let connectionGuardian apply life-support
	 * @param {Object} connection The new connection
	 * @param {Object} request The request of the connection
	 */
	handleNewConnection(connection, request) {

		Logger.log(`New connection established from IP: ${request.connection.remoteAddress}`)

		// Increase connections for the guard
		connectionGuardian.increaseConnections()

		connection.on('message', raw => this.handleMessage(decodeRawMessage(raw, connection), connection))
		connection.on('close', () => this.handleClose(connection, request))
		connection.on('pong', () => connectionGuardian.heartbeat(connection, request))

	}
}