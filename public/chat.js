// Make connection
let socketClient = io.connect('http://localhost:3000')

// Query DOM
const messageDOM = document.querySelector('#message');
const handleDOM = document.querySelector('#handle');
const btnDOM = document.querySelector('#send');
const outputDOM = document.querySelector('#output');
const feedbackDOM = document.querySelector('#feedback');

// Emit events
btnDOM.addEventListener('click', () => {
    socketClient.emit('chat', {
        message: messageDOM.value,
        handle: handleDOM.value
    })
})

messageDOM.addEventListener('keypress', () => {
    socketClient.emit('typing', handleDOM.value)
})

socketClient.on('chat', data => {
    feedbackDOM.innerHTML = '';
    outputDOM.innerHTML += '<p><strong>' + data.handle + '</strong>' + data.message + '<p/>'
})

socketClient.on('typing', data => {
    feedbackDOM.innerHTML = '<p><em>' + data + ' is typing a message</em></p>';
})