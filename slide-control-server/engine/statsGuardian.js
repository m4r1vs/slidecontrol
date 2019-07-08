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

const fs = require('fs')

module.exports = class StatsGuardian {

	constructor() {

		this.stats = {}

		if (fs.existsSync('../stats.json')) {
			let stats = fs.readFileSync("../stats.json")
			this.stats = JSON.parse(stats)
			console.log('Got old stats file', this.stats)
		} else {
			this.stats = {}
			console.log('No stats file found. Created new object.')
		}

		this.increaseStat = this.increaseStat.bind(this)
		this.changeStat = this.changeStat.bind(this)
		this.saveStats = this.saveStats.bind(this)

		setInterval(this.saveStats, 2000)
	}

	/**
	 * Increase a given stat
	 * @param {String} stat - The stat to be increased
	 * @param {Integer} value - By how much
	 */
	increaseStat(stat, value) {
		if (this.stats[stat]) this.stats[stat] += value
		else this.stats[stat] = value
	}

	/**
	 * Change a given stat
	 * @param {String} stat - The stat to be changed
	 * @param {Integer} value - To what value
	 */
	changeStat(stat, value) {
		this.stats[stat] = value
	}

	/**
	 * Save the stats
	 */
	saveStats() {
		Logger.debug('Saving stats', JSON.stringify(this.stats))
		fs.writeFile('../stats.json', JSON.stringify(this.stats), err => {
			if (err) Logger.error('Could not save stats:', this.stats.toString())
			Logger.debug("Saved stats:", this.stats)
		})
	}
}