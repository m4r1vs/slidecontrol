// create the laserpointer
export default class Laserpointer {

	constructor(Logger) {

		Logger.log("created laserpointer")
		Logger.log("muhahahahahahahaaa")

		this.element = document.createElement("div")

		this.element.id = "laserpointer"
		this.element.style = `
            position: relative;
            width: 14px;
            height: 14px;
            transition: opacity, transform .45s;
            background: red;
            border-radius: 7px;
            border-top-left-radius: 0;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, .87);
            z-index: 5;
            bottom: 100px;
            left: 100px;
        `

		this.slideWrapper = document.querySelector(".punch-viewer-content")
		this.slideWrapper.insertBefore(this.element, this.slideWrapper.firstChild)

		this.x = 100,
		this.y = 100,
		this._x = 0,
		this._y = 0
	}

    /**
     * Show the laserpointer (make it more visible)
     */
	show() {
		window.requestAnimationFrame(() => {
			this.element.style.opacity = "1"
			this.element.style.transform = "scale(8)"
			setTimeout(() => {
				this.element.style.transform = "scale(1)"
			}, 150);
		})
	}

    /**
     * Move the laserpointer into relative direction
     * @param {Number} x the relative X coordinate
     * @param {Number} y the relative Y coordinate
     */
	move(x, y) {

		window.requestAnimationFrame(() => {
            
            // cant got out of bounds
			if ((this.x + x) < 0) this.x = 0
			if ((this.y + y) < 0) this.y = 0
			if ((this.x + x) > parseInt(this.slideWrapper.style.width)) this.x = parseInt(this.slideWrapper.style.width)
			if ((this.y + y) > parseInt(this.slideWrapper.style.height)) this.y = parseInt(this.slideWrapper.style.height)

			this.element.style.left = `${this.x + x * 3}px`
			this.element.style.top = `${this.y + y * 3}px`

			this._x = x * 3
			this._y = y * 3
		})

	}

    /**
     * Make laserpointer less visible
     */
	hide() {

		window.requestAnimationFrame(() => {
			this.x = this.x + this._x
			this.y = this.y + this._y
			this.element.style.opacity = "0.3"
		})

	}
}