const WebSocket = require('ws')
const https = require('https')
const fs = require('fs')

const PORT = 61263

// ssl-server so wss:// is possible
const httpsServer = new https.createServer({
	cert: fs.readFileSync('/home/m4r1vs/.config/letsencrypt/live/www.maniyt.de/cert.pem'),
	key: fs.readFileSync('/home/m4r1vs/.config/letsencrypt/live/www.maniyt.de/privkey.pem')
})

const server = new WebSocket.Server({ server: httpsServer })

// object holds all currently synced presentations
let slides = {}

const Logger = {
    log: log => console.log(`[${new Date()}] ${log}`)
}

/**
 * Regsiter new presentation to server
 */
const handleNewSlide = (message, connection) => {

    const code = parseInt(message.code)

    // check for quality of code
    if (!code) return
    if (isNaN(code)) return
    if (code < 1000 || code > 99999) return
    if (slides[code]) {
        connection.send(JSON.stringify({
            reason: 'error-slide-code-taken'
        }))
        return
    }

    connection.slideCode = code

    // append presentation to object
    slides[code] = {
        title: message.title,
        notes: message.notes,
        activeSlide: message.activeSlide,
        totalSlides: message.totalSlides
    }

    Logger.log(`Created new slide with id #${code}`)

    // notify extension that slide got registered successfully
    connection.send(JSON.stringify({
        reason: 'slide-created',
        code
    }))
}

/**
 * New controller wants to establish connection to slide.
 */
const handleNewController = (message, connection) => {
    
    const code = parseInt(message.code)

    // check if presentation exists under given code
    if (slides[code]) {
        connection.controllerCode = code

        // send initial info to app
        connection.send(JSON.stringify({
            reason: 'send-slide-info',
            title: slides[code].title,
            notes: slides[code].notes,
            activeSlide: slides[code].activeSlide,
            totalSlides: slides[code].totalSlides
        }))

        // notify extension of new synced device
        server.clients.forEach(client => {
            if (client.slideCode && client.slideCode === code) {
                client.send(JSON.stringify({
                    reason: 'new-device-synced',
                    code
                }))
            }
        })
    }
    else {
        connection.send(JSON.stringify({
            reason: 'slide-code-not-found'
        }))
    }
}

/**
 * Controller wants to change slide, do so.
 */
const handleSwitchSlide = message => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: message.reason
            }))
        }
    })
}

/**
 * Extension observed change of slides, make all controllers know
 */
const handleSlideChange = (message, connection) => {
    server.clients.forEach(client => {
        if (client.controllerCode && client.controllerCode === connection.slideCode) {
            client.send(JSON.stringify({
                reason: 'slide-changed',
                notes: message.notes,
                activeSlide: message.activeSlide
            }))
        }
    })
}

/**
 * controller wants to know if given code valid
 */
const checkSlideCode = (message, connection) => {
    const code = parseInt(message.code)

    if (slides[code]) connection.send(JSON.stringify({
        reason: 'slide-code-ok',
        code
    }))
    else connection.send(JSON.stringify({
        reason: 'slide-code-not-ok',
        code
    }))
}

/**
 * make extension show laserpointer
 */
const handleLaserpointerStart = message => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: 'laserpointer-down'
            }))
        }
    })
}

/**
 * let extension know that laserpointer shall be moved in given direction
 */
const handleLaserpointerMove = message => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: 'laserpointer-move',
                x: message.x,
                y: message.y
            }))
        }
    })
}

/**
 * and hide the laser again
 */
const handleLaserpointerEnd = message => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: 'laserpointer-up'
            }))
        }
    })
}

/**
 * Map the right action to the recieved message
 * @param {Object} message the message from sender
 * @param {Connection} connection the connection thats sending message
 */
const handleMessage = (message, connection) => {
    if (!message) return

    const map = {
        'check-slide-code': () => checkSlideCode(message, connection),
        'register-controller': () => handleNewController(message, connection),
        'new-slide': () => handleNewSlide(message, connection),
        'next-slide': () => handleSwitchSlide(message, connection),
        'previous-slide': () => handleSwitchSlide(message, connection),
        'slide-changed': () => handleSlideChange(message, connection),
        'laserpointer-start': () => handleLaserpointerStart(message),
        'laserpointer-move': () => handleLaserpointerMove(message),
        'laserpointer-end': () => handleLaserpointerEnd(message)
    }

    if (map[message.reason]) map[message.reason]()

}

/**
 * remove slide from slide object when closed
 * @param {Connection} connection the closed connection
 */
const handleClose = connection => {
    Logger.log(`Connection closed`)
    if (connection.slideCode) slides[connection.slideCode] = null
}

// New connection established:
server.on('connection', connection => {
    connection.on('message', raw => handleMessage(JSON.parse(raw), connection))
    connection.on('close', () => handleClose(connection))
})

// finally listen to the port:
httpsServer.listen(PORT)