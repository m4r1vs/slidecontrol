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

export default class QRCodeWindow {
  constructor(presentationID) {
    this.element = document.createElement("div");
    this.background = document.createElement("div");

    this.element.id = "qr-code-window";
    this.background.id = "qr-code-window-background";

    this.element.style = `
			position: fixed;
			z-index: 10;
			border-radius: 28px;
			opacity: 0;
			display: none;
			padding: 32px;
			transition: opacity .32s;
			top: calc(35vh - (272px / 2) - 32px);
			left: calc(50vw - (272px / 2) - 32px);
			width: 272px;
			height: 272px;
			background: #212121;
		`;

    this.background.style = `
			position: fixed;
			opacity: 0;
			transition: opacity .32s;
			z-index: 9;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: #000;
			display: none;
		`;

    this.background.addEventListener("click", this.hide.bind(this));

    new QRCode(this.element, {
      text: `https://slides.niveri.dev/controller/${presentationID}`,
      height: 272,
      width: 272,
      colorDark: "#ffbc16", // yellow
      colorLight: "#212121", // almost-black
      correctLevel: QRCode.CorrectLevel.H,
    });

    document.body.insertBefore(this.element, document.body.firstChild);
    document.body.insertBefore(this.background, document.body.firstChild);
  }

  /**
   * Toggle visibility of QR-Code
   */
  toggle() {
    if (this.element.style.display === "none") this.show();
    else this.hide();
  }

  /**
   * Show the QR code window
   */
  show() {
    if (this.element.style.display === "block") return;

    this.element.style.display = "block";
    this.background.style.display = "block";

    setTimeout(() => {
      this.element.style.opacity = 1;
      this.background.style.opacity = 0.618;
    }, 20);
  }

  /**
   * Hide the QR code window
   */
  hide() {
    if (this.element.style.display === "none") return;

    this.element.style.opacity = "0";
    this.background.style.opacity = "0";

    setTimeout(() => {
      this.element.style.display = "none";
      this.background.style.display = "none";
    }, 320);
  }
}
