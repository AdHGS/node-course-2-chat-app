const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation.js')
const {Users} = require ('./utils/users.js')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {

   console.log(`Inbound connection from: ${socket.request.connection.remoteAddress}:${socket.request.connection.remotePort}`);
  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
    return callback('Name and room name are required!')
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    console.log(`Client ${params.name} joined ${params.room}`);
    socket.emit('newMessage', generateMessage('Admin',`Welcome to ${params.room}, ${params.name}!`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the channel!`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (coords) => {
      io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

      if (user) {
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has disconnected from the channel.`));
      }

  })
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}!...`);
});
