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

export default class ClosedCaptions {
  constructor() {
    this.ccContainer = document.createElement("span");

    this.ccContainer.style = `
			position: fixed;
			left: 0;
			bottom: 0;
			height: auto;
			width: 100vw;
			z-index: 2000;
			display: none;
			padding: 12px 26px;
			pointer-events: none;
			font-size: 32px;
			color: #fff;
			text-align: center;
			background: rgba(0,0,0,.57);
		`;

    document.body.appendChild(this.ccContainer);

    this.timeout = null;
  }

  /**
   * Show closed captions
   * @param {String} cc The to-be-shown subtitles
   */
  show(cc) {
    this.ccContainer.style.display = "block";
    this.ccContainer.textContent = cc;
    this.timeout = setTimeout(() => this.hide(false), 4500);
  }

  /**
   * Hide the closed captions completely
   * @param {Boolean} removeCompletely If true, display = none
   */
  hide(removeCompletely) {
    if (removeCompletely) this.ccContainer.style.display = "none";
    this.ccContainer.textContent = "";
  }

  /**
   * Set subtitles to be-shown, if none, hide the bar
   * @param {String} cc The to-be-shown subtitles, if none, hide()
   */
  set(cc) {
    if (this.timeout) clearTimeout(this.timeout);

    if (!cc) this.hide(true);
    else this.show(cc);
  }
}
