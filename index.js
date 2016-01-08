var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('serve-favicon');

app.use(favicon(__dirname + '/favicon.ico'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});
app.get('/styles.css', function(req, res){
  res.sendFile(__dirname + '/styles.css');
});
app.get('/client.js', function(req, res){
  res.sendFile(__dirname + '/client.js');
});

app.use(express.static('public'));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
	socket.broadcast.emit('chat message', msg);
	socket.emit('local chat message', msg);
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});