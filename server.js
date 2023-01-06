const global = require('./global');
const customError = require('./customErrors');
const commandHandler = require('./commandHandler');
const user = require('./user');
const broadcast = require('./broadcast');
const net = require('net');

function createServer() {
  var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    // color code red \x1b\[31m 
    socket.write('Globaler Group Chat\r\n!!! Achtung nicht verschlüsselt !!!\r\n\r\nBenutzernamen eingeben:\r\n');

    socket.on('data', function (data) {
      try {
        user.setUsernameIfNotDefined(socket, data);
        commandHandler.query(socket, data);
        broadcast.echoToAllSockets(socket, data);
      } catch (error) {
        if (!(error instanceof customError.StopParent)) {
          throw error;
        }
      }
    })

    socket.on('error', function () {
      let item = global.allSockets.find(obj => {
        return obj.socket == socket;
      })
      global.allSockets.splice(global.allSockets.indexOf(item), 1);
    })
  });

  server.listen(1337, '0.0.0.0');
}

createServer();