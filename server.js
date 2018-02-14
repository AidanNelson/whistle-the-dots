// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

// Create socket connection
let io = require('socket.io').listen(server);

let levelOne = [];
  for (let i = 0; i< 10; i++){
    // let x = floor(random(width));
    // let y = floor(random(height));
    let newDot = {
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500)
    }
    levelOne.push(newDot);
  }


// Listen for clients to connect and disconnect and do stuff
io.sockets.on('connection', function(socket){
  console.log('A client connected');
  
  socket.on('sendDots', function(){
    io.sockets.emit('initialDots', levelOne);
  });
  
  socket.on('volume', function(volume) {
    console.log("Received: 'volume' " +  volume);
    io.sockets.emit('volume', volume);
  });

  socket.on('pitch', function(pitch) {
    console.log("Received: 'pitch' " +  pitch);
    io.sockets.emit('pitch', pitch);
  });

  socket.on('disconnect', function() {
    console.log("A client has disconnected");
  });
});
