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

export default class Watermark {

	constructor() {

		this.watermark = document.createElement('div')

		this.watermark.style = `
			display: none;
			text-align: center;
			position: fixed;
			bottom: 24px;
			right: 24px;
			height: 96px;
			width: 96px;
			opacity: .57;
			user-select: none;
			background: #000;
			border-radius: 50%;
			padding: 10px 8px 4px 8px;
			border: 1px solid #ffbc16;
			color: #ffbc16;
			line-height: 42px;
			font-size: 22px;
			font-weight: 100;
			font-family: Roboto, Helvetica, Arial;
		`
		this.watermark.innerHTML = `
			<div style='background: url(https://slidecontrol.niveri.xyz/assets/logo.svg); margin: auto; background-size: contain; height: 48px; width: 48px;'> </div>
			<span id="slidecontrol-watermark">#ERROR</span>
		`

		document.body.appendChild(this.watermark)
	}

	/**
	 * Show a watermark with ID of current slide
	 * @param {Number} presentationID The ID to be shown in the watermark
	 */
	show(presentationID) {
		document.getElementById('slidecontrol-watermark').textContent = `#${presentationID}`
		this.watermark.style.display = 'block'
	}

	/**
	 * Hide the watermark
	 */
	hide() {
		this.watermark.style.display = 'none'
	}

	/**
	 * Toggle a watermark with ID of current slide
	 * @param {Number} presentationID The ID to be shown in the watermark
	 */
	toggle(presentationID) {
		if (this.watermark.style.display === 'none') this.show(presentationID)
		else this.hide()
	}
}