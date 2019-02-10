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
let slides = {},
    connections = 0

const Logger = {
    log: log => console.log(`[${new Date()}] ${log}`),
    debug: (log, data) => (process.env.DEBUG === 'true') && console.log(log, data)
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
                connection.connectedConnection = client
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
const handleSwitchSlide = (message, connection) => {
    if (connection.connectedConnection.OPEN) connection.connectedConnection.send(JSON.stringify({
        reason: message.reason
    }))
}

/**
 * Extension observed change of slides, make all controllers know
 */
const handleSlideChange = (message, connection) => {
    server.clients.forEach(client => {
        if (client.controllerCode && client.controllerCode === connection.slideCode) {
            slides[connection.slideCode].notes = message.notes
            slides[connection.slideCode].activeSlide = message.activeSlide
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
const handleLaserpointerStart = connection => {
    if (connection.connectedConnection.OPEN) connection.connectedConnection.send(JSON.stringify({
        reason: 'laserpointer-down'
    }))
}

/**
 * let extension know that laserpointer shall be moved in given direction
 */
const handleLaserpointerMove = (message, connection) => {
    if (connection.connectedConnection.OPEN) connection.connectedConnection.send(JSON.stringify({
        reason: 'laserpointer-move',
        x: message.x,
        y: message.y
    }))
}

/**
 * and hide the laser again
 */
const handleLaserpointerEnd = connection => {
    if (connection.connectedConnection.OPEN) connection.connectedConnection.send(JSON.stringify({
        reason: 'laserpointer-up'
    }))
}

/**
 * Map the right action to the recieved message
 * @param {Object} message the message from sender
 * @param {Connection} connection the connection thats sending message
 */
const handleMessage = (message, connection) => {

    Logger.debug('New command recieved: ', message)

    if (!message) return

    const map = {
        'check-slide-code': () => checkSlideCode(message, connection),
        'register-controller': () => handleNewController(message, connection),
        'new-slide': () => handleNewSlide(message, connection),
        'next-slide': () => handleSwitchSlide(message, connection),
        'previous-slide': () => handleSwitchSlide(message, connection),
        'slide-changed': () => handleSlideChange(message, connection),
        'laserpointer-start': () => handleLaserpointerStart(connection),
        'laserpointer-move': () => handleLaserpointerMove(message, connection),
        'laserpointer-end': () => handleLaserpointerEnd(connection)
    }

    if (map[message.reason]) map[message.reason]()

}

/**
 * remove slide from slide object when closed
 * @param {Connection} connection the closed connection
 */
const handleClose = connection => {
    connections--
    Logger.log(`Connection closed, now ${connections} connections`)
    if (connection.slideCode) slides[connection.slideCode] = null
}

/**
 * Set is alive when pong is recieved
 */
const heartbeat = (connection, ip) => {
    Logger.debug('Recieved heartbeat from ', ip)
    connection.isAlive = true
}

// New connection established:
server.on('connection', (connection, req) => {
    connections++
    Logger.log(`${req.connection.remoteAddress} connected, now ${connections} connections`)
    connection.isAlive = true
    connection.on('message', raw => handleMessage(JSON.parse(raw), connection))
    connection.on('close', () => handleClose(connection))
    connection.on('pong', () => heartbeat(connection, req.connection.remoteAddress))
})

/**
 * Ping all connected instances to check if alive
 */
const ping = () => {
    
    Logger.log(`Checking if ${connections} connections still alive...`)

    server.clients.forEach(client => {

        if (client.isAlive === false) {
            Logger.log('    - Client dead, killed')
            return client.terminate()
        }

        Logger.log('    - Client alive, kept alive')
        
        client.isAlive = false
        client.ping()
    })
}

// ping every minute
setInterval(ping, 60000);

// finally listen to the port:
httpsServer.listen(PORT)

console.log('==== SLIDECONTROL WEBSOCKET SERVER v1.2.6f ====')
console.log('====                                       ====')
console.log(`====        Listening on port ${PORT}        ====`)
console.log('====                                       ====')
console.log('===============================================\n\n')