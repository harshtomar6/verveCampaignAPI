//Dependencies
let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let logger = require('morgan');
let http = require('http');
let socketio = require('socket.io')
let config = require('./config');
let homeRoute = require('./routes/homeRoute');
let db = require('./models/db');

//Initialize express app;
const app = express();

//Connect to database;
mongoose.connect(config.DATABASE_URI);

//Use Body Parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Logger middleware
app.use(logger('dev'));

//Set App routes
app.use('/', homeRoute)

//Use WebSockets
let server = http.Server(app);
let io = socketio(server);

io.on('connection', (socket) => {
  console.log('A Client Connected ', socket.id);

  socket.on('reset-passes', data => {
    console.log(data);

    db.deallotPasses(data.id, (err, success) => {
      if(err)
        socket.emit('err', {err: err, data: null});
      else{
        socket.emit('ok', {err: null, success: success});
        socket.emit('not-alloted');
      }
    })
  })

  socket.on('read-passes-status', data => {
    db.readPassesStatus(data.id, (alloted, passes) => {
      if(alloted)
        socket.emit('alloted', passes);
      else
        socket.emit('not-alloted');
    })
  })

  socket.on('disconnect', () => {console.log('Client Disconnected')});
})

//Start server to listen HTTP requests
server.listen(config.PORT, () => {
  console.log("Server is LIVE at port "+config.PORT);
});

module.exports = server;
