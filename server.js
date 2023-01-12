const net = require('net');
const os = require('os');

const global = require('./global');
const customError = require('./customErrors');
const commandHandler = require('./commandHandler');
const user = require('./user');
const messaging = require('./messaging');

let args = process.argv.slice(2);
let port = args.length > 0 ? args[0] : 1337;
let localIP = [].concat(...Object.values(os.networkInterfaces())).find(x => !x.internal && x.family === 'IPv4')?.address


function createServer() {
  var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    // color code red \x1b\[31m 
    messaging.sendRawLine(socket, "Globaler Group Chat\r\n!!! Achtung nicht verschlüsselt !!!\r\n\r\nBenutzernamen eingeben: ");

    socket.on('data', function (message) {
      message = message.replace(/\r|\n/g, '');
      try {
        user.setUsernameIfNotDefined(socket, message);
        commandHandler.query(socket, message);
        messaging.broadcast(socket, message);
      } catch (error) {
        if (!(error instanceof customError.StopParent)) {
          throw error;
        }
      }
    })

    socket.on('close', function () { disconnectHandler(socket) });
    socket.on('timeout', function () { disconnectHandler(socket) });
    socket.on('error', function () { disconnectHandler(socket) });
  });

  server.listen(port, '0.0.0.0', () => {
    console.log("Server started\nTo connect a client: 'nc " + localIP + " " + server.address().port + "'");
  });
}

function disconnectHandler(socket) {
  let item = global.getConnection(socket);
  additionalmsg = (item.goodbye&&item.goodbye!='') ? ' and said: '+item.goodbye : ''
  global.allConnections.splice(global.allConnections.indexOf(item), 1);
  user.updateLongestUsername();
  messaging.broadcastRaw(undefined, item.username + " disconnected" + additionalmsg );
}

function closeSocketConnection(socket) {
  socket.destroy();
}

createServer();

module.exports.closeSocketConnection = closeSocketConnection;
