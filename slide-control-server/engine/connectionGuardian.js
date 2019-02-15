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

/**
 * Keeps track of active connection and closes broken ones
 */
module.exports = class ConnectionGuardian {

	constructor() {
		this.connections = 0
		setInterval(this.ping, 60000);
	}

	increaseConnections() { this.connections++ }
	decreaseConnections() { this.connections-- }

	/**
	 * Ping every connection every minute
	 */
	ping() {

		Logger.log(`Checking if ${this.connections} connections still alive...`)

		wssServer.clients.forEach(connection => {

			if (connection.__isAlive__ === false) {
				Logger.log('    - Connection dead, killed')
				return connection.terminate()
			}

			Logger.log('    - Connection alive, kept alive')

			connection.__isAlive__ = false
			connection.ping()
		})
	}

	/**
	 * Runs when connection recieved and answered to ping
	 * @param {Object} connection The connection that is alive
	 * @param {Object} request Request the connection is from
	 */
	heartbeat(connection, request) {
		Logger.debug('Recieved heartbeat from IP: ', request.connection.remoteAddress)
		connection.__isAlive__ = true
	}
}