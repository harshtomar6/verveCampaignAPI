let server = require('./server');
let io = require('socket.io')(server);



module.exports = io;