const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 1337 });

let slides = {}

const Logger = {
    log: log => console.log(`[${new Date()}] ${log}`)
}

const handleNewSlide = (message, connection) => {

    const code = parseInt(message.code)

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

    slides[code] = {
        title: message.title,
        notes: message.notes,
        activeSlide: message.activeSlide,
        totalSlides: message.totalSlides
    }

    Logger.log(`Created new slide with id #${code}`)

    connection.send(JSON.stringify({
        reason: 'slide-created',
        code
    }))
}

const handleNewController = (message, connection) => {
    
    const code = parseInt(message.code)

    if (slides[code]) {
        connection.controllerCode = code
        connection.send(JSON.stringify({
            reason: 'send-slide-info',
            title: slides[code].title,
            notes: slides[code].notes,
            activeSlide: slides[code].activeSlide,
            totalSlides: slides[code].totalSlides
        }))

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

const handleSwitchSlide = message => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: message.reason
            }))
        }
    })
}

const handleSlideChange = (message, connection) => {
    server.clients.forEach(client => {
        if (client.controllerCode && client.controllerCode === connection.slideCode) {
            client.send(JSON.stringify({
                reason: 'slide-changed',
                notes: message.notes,
                currentSlide: message.currentSlide
            }))
        }
    })
}

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

const handleLaserpointerStart = (message, connection) => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: 'laserpointer-down'
            }))
        }
    })
}

const handleLaserpointerMove = (message, connection) => {
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

const handleLaserpointerEnd = (message, connection) => {
    server.clients.forEach(client => {
        if (client.slideCode && client.slideCode === parseInt(message.code)) {
            client.send(JSON.stringify({
                reason: 'laserpointer-up'
            }))
        }
    })
}

const handleMessage = (message, connection) => {
    if (!message) return

    if (message.reason === 'check-slide-code') checkSlideCode(message, connection)
    if (message.reason === 'register-controller') handleNewController(message, connection)
    if (message.reason === 'new-slide') handleNewSlide(message, connection) 
    if (message.reason === 'next-slide' || message.reason === 'previous-slide') handleSwitchSlide(message, connection)
    if (message.reason === 'slide-changed') handleSlideChange(message, connection)
    if (message.reason === 'laserpointer-start') handleLaserpointerStart(message, connection)
    if (message.reason === 'laserpointer-move') handleLaserpointerMove(message, connection)
    if (message.reason === 'laserpointer-end') handleLaserpointerEnd(message, connection)
}

const handleClose = connection => {
    Logger.log(`Connection closed`)
    if (connection.slideCode) slides[connection.slideCode] = null
}

server.on('connection', connection => {
    connection.on('message', raw => handleMessage(JSON.parse(raw), connection))
    connection.on('close', () => handleClose(connection))
})