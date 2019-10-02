const express = require('express');
const socketPackage = require('socket.io');
const bodyParser = require('body-parser');

// App setup
const app = express();
let server = app.listen(3000, () => {
    console.log('Listening at ' + 3000)
})

app.use(express.static('public'))


// Socket setup
let io = socketPackage(server)

function getSocketsKeys(sockets) {
    let keys = [];
    for (let key in sockets)
        keys.push(key);
    return keys
}

io.on('connection', (socket) => {
    io.sockets.emit('keys-share', { keys: getSocketsKeys(io.sockets.connected) })


    socket.on('creating-connection', data => {
        socket.emit('me', { mySocket: socket.id })
        io.sockets.emit('keys-share', { keys: getSocketsKeys(io.sockets.connected) })
    })

    socket.on('disconnect', data => {
        console.log(socket.id)
        io.sockets.emit('keys-share', { keys: getSocketsKeys(io.sockets.connected) })
    })

    socket.on('invite', data => {
        io.sockets.sockets[data.addressee].emit('invitation', data)
        // io.sockets.sockets[data.addressee].emit('invitation', { sender: data.sender, addressee: data.addressee })
    })

    socket.on('reject', data => {
        io.sockets.sockets[data.me].emit('invitation', null)
    })

    socket.on('accept', data => {
        console.log(data)
        io.sockets.sockets[data.sender].emit('onAccept', data)
    })

})
