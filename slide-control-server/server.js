const WebSocket = require('ws')
const http = require('http')
const fs = require('fs')

// PORT is defined in ./port.config file
var PORT = parseInt(fs.readFileSync("./port.config"))

// when someone requests the websocket server via HTTP(S)
const httpHandler = (req, res) => {
    res.end('You weren\'t supposed to see this lol')
}

// ssl-server so wss:// is possible
const httpServer = http.createServer(httpHandler)

const server = new WebSocket.Server({ server: httpServer })

// object holds all currently synced presentations
let presentations = {},
    connections = 0

// start server with "DEBUG=true" to see debug logs
const Logger = {
    log: log => console.log(`[${new Date()}] ${log}`),
    debug: (log, data) => (process.env.DEBUG === 'true') && console.log(log, data)
}

/**
 * Regsiter new presentation to server
 */
const handleNewSlide = (message, connection) => {

    const presentationID = parseInt(message.code)

    // check for quality of code
    if (!presentationID) return
    if (isNaN(presentationID)) return
    if (presentationID < 1000 || presentationID > 99999) return
    if (presentations[presentationID]) {
        connection.send(JSON.stringify({
            reason: 'error-slide-code-taken'
        }))
        return
    }

    connection.slideCode = presentationID

    // append presentation to object
    presentations[presentationID] = {
        title: message.title,
        notes: message.notes,
        activeSlide: message.activeSlide,
        totalSlides: message.totalSlides
    }

    Logger.log(`Created new slide with id #${presentationID}`)

    // notify extension that slide got registered successfully
    connection.send(JSON.stringify({
        reason: 'slide-created',
        code: presentationID
    }))
}

/**
 * New controller wants to establish connection to slide.
 */
const handleNewController = (message, connection) => {
    
    const presentationID = parseInt(message.code)

    // check if presentation exists under given code
    if (presentations[presentationID]) {
        connection.controllerCode = presentationID

        // send initial info to app
        connection.send(JSON.stringify({
            reason: 'send-slide-info',
            title: presentations[presentationID].title,
            notes: presentations[presentationID].notes,
            activeSlide: presentations[presentationID].activeSlide,
            totalSlides: presentations[presentationID].totalSlides
        }))

        // notify extension of new synced device
        server.clients.forEach(client => {
            if (client.slideCode && client.slideCode === presentationID) {
                connection.connectedConnection = client
                client.send(JSON.stringify({
                    reason: 'new-device-synced',
                    code: presentationID
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
            presentations[connection.slideCode].notes = message.notes
            presentations[connection.slideCode].activeSlide = message.activeSlide
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

    if (presentations[code]) connection.send(JSON.stringify({
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
 * Toggle the given webpage in the chrome extension
 */
const handleWebpageToggle = (message, connection) => {
    if (connection.connectedConnection.OPEN) connection.connectedConnection.send(JSON.stringify({
        reason: 'toggle-webpage',
        url: message.url
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
        'laserpointer-end': () => handleLaserpointerEnd(connection),
        'toggle-webpage': () => handleWebpageToggle(message, connection)
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
    if (connection.slideCode) presentations[connection.slideCode] = null
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
httpServer.listen(PORT, error => {

    if (error) console.error('Error starting Server: ', error)
    else {
        console.log('==== SLIDECONTROL WEBSOCKET SERVER v1.2.6f ====')
        console.log('====                                       ====')
        console.log(`====        Listening on port ${PORT}         ====`)
        console.log('====                                       ====')
        console.log('===============================================\n\n')
    }

})
