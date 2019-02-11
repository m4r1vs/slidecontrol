// generate QR code with given ID
export default class QRCodeWindow {

    constructor(presentationID) {

        this.element = document.createElement("div")
        this.background = document.createElement("div")

        this.element.id = "qr-code-window"
        this.background.id = "qr-code-window-background"

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
        `

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
        `
        
        this.background.addEventListener("click", this.hide.bind(this))

        new QRCode(this.element, {
            text: `sc.niveri.xyz/controller/${presentationID}`,
            height: 272,
            width: 272,
            colorDark: '#ffbc16', // yellow
            colorLight: '#212121', // almost-black
            correctLevel: QRCode.CorrectLevel.H
        })

        document.body.insertBefore(this.element, document.body.firstChild)
        document.body.insertBefore(this.background, document.body.firstChild)
    }

    /**
     * Toggle visibility of QR-Code
     */
    toggle() {
        (this.element.style.display === "none") ? this.show(): this.hide()
    }

    /**
     * Show the QR code window
     */
    show() {
        if (this.element.style.display === "block") return

        this.element.style.display = "block"
        this.background.style.display = "block"

        setTimeout(() => {
            this.element.style.opacity = 1
            this.background.style.opacity = 0.618
        }, 20);
    }

    /**
     * Hide the QR code window
     */
    hide() {
        if (this.element.style.display === "none") return

        this.element.style.opacity = "0"
        this.background.style.opacity = "0"

        setTimeout(() => {
            this.element.style.display = "none"
            this.background.style.display = "none"
        }, 320);
    }
}