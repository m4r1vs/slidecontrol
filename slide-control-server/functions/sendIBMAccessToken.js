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

const fetch = require('node-fetch')

// the IBM api key in /slide-control-server/ibm-api-key.key
const IBM_API_KEY = require('../ibm-api-key')

/**
 * Respond to requests to /ibm-access-token with the IBM access token
 * @param {Object} res the response send back
 */
module.exports = sendIBMAccessToken = (req, res) => {

	Logger.debug('Will get IBM access_token, with key: ', `"${IBM_API_KEY}"`)

	// enable cross origin requests
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Headers', '*');

	// get token from IBM and send as response
	fetch('https://iam.bluemix.net/identity/token?grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=' + IBM_API_KEY, {
		method: 'POST',
		mode: 'cors',
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/x-www-form-urlencoded"
		}
	})
		.then(data => data.json())
		.then(json => {

			Logger.debug('Got IBM access_token: ', json)

			res.write(JSON.stringify(json))
			res.end()
		})
		.catch(error => Logger.error('Error getting access_token from IBM server: ', error))
}