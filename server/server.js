const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString, toTitleCase} = require('./utils/validation.js')
const {Users} = require ('./utils/users.js')
const {Rooms} = require ('./utils/rooms.js')
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
var rooms = new Rooms();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    io.emit('updateRoomList', rooms.removeDuplicates());

    socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
    return callback('Name and room name are required!')
    }
    if(params.name.length < 2){
    return callback('Username must be 2 characters or over!')
    }
    var dupeCheck = users.dupeResult(params.name, params.room);
    if (dupeCheck.length > 0){
      console.log(`[${params.room}] ${params.name} tried to connect but the username was taken (${socket.request.connection.remoteAddress})`)
      return callback('A user with that name already exists in this channel!')
    }

    if (socket.request.connection.remoteAddress == "::1"){
      var connIP  = 'localhost';
}else{
  var connIP = socket.request.connection.remoteAddress;
}
        console.log(`[${params.room}] ${params.name} connected (${connIP}:${socket.request.connection.remotePort})`);
    rooms.addRoom(params.room);
    io.emit('updateRoomList', rooms.removeDuplicates());

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin',`Welcome to ${params.room}, ${params.name}!`));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} joined the channel!`));
    callback();
    });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
      io.to(user.room).emit('notification', user.name)
      console.log(`[${user.room}] ${user.name}: ${message.text}`)
      }
      callback();
  });

  socket.on('createLocationMessage', (coords) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
      console.log(`${user.name} > ${user.room}: locationMessage`)
      }
  });

  socket.on('isTyping', () => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('isTyping', user.name)
});

  socket.on('notTyping', () => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('notTyping', user.name)
  });

  socket.on('disconnect', () => {
    if (socket.request.connection.remoteAddress == "::1"){
      var connIP  = 'localhost';
}else{
  var connIP = socket.request.connection.remoteAddress;
}
              var user = users.removeUser(socket.id);
      if (user) {
        console.log(`[${user.room}] ${user.name} disconnected (${connIP}:${socket.request.connection.remotePort})`)
        io.to(user.room).emit('updateUserList', users.getUserList(user.room));
        io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has disconnected from the channel.`));
        if(users.getUserList(user.room) == 0){
            io.emit('removeRoom', rooms.removeRoom(user.room));
            io.emit('updateRoomList', rooms.removeDuplicates());
        }
      }
  })
});

server.listen(port, () => {
  console.log(`Server is running (${port})!...`);
});
