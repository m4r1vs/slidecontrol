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

export default class MiniBrowser {
  constructor() {
    this.iFrame = null;
  }

  /**
   * Show an iFrame with given URL
   * @param {String} url The webpages URL
   */
  show(url) {
    this.iFrame = document.createElement("iFrame");

    this.iFrame.style = `
				position: fixed;
				left: 0;
				top: 0;
				height: 100vh;
				width: 100vw;
				z-index: 1000;
				display: block;
		`;

    this.iFrame.setAttribute("src", url);

    document.body.appendChild(this.iFrame);
  }

  /**
   * Hide the webpage
   */
  hide() {
    if (!this.iFrame) return;

    this.iFrame.remove();
    this.iFrame = null;
  }

  /**
   * Toggle the MiniBrowser
   * @param {String} url The url (if it should be shown)
   */
  toggle(url) {
    if (this.iFrame) this.hide();
    else this.show(url);
  }
}
