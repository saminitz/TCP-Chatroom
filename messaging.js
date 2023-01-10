const global = require('./global');
const user = require('./user');

function broadcast(socket, message) {
  for (let connection of global.allConnections) {
    if (connection.socket != socket) {
      sendMessage(connection.socket, user.getUsername(socket), message);
    }
  }
  if (socket != undefined) {
    usernamePreview(socket);
  }
}

function broadcastRaw(socket, text) {
  for (let connection of global.allConnections) {
    if (connection.socket != socket) {
      sendRawLineAndUser(connection.socket, text);
    }
  }
  if (socket != undefined) {
    usernamePreview(socket);
  }
}

function usernamePreview(socket) {
  socket.write("\r" + user.usernameAndSpacing(user.getUsername(socket)) + ": ");
}

function sendRawLine(socket, text) {
  socket.write("\r" + text + "\r\n");
}

function sendRawLineAndUser(socket, text) {
  sendRawLine(socket, text);
  usernamePreview(socket);
}

function sendMessage(socket, senderName, text) {
  socket.write("\r" + user.usernameAndSpacing(senderName) + " -> " + text + "\r\n");
  usernamePreview(socket);
}

module.exports.broadcast = broadcast;
module.exports.broadcastRaw = broadcastRaw;
module.exports.sendRawLine = sendRawLine;
module.exports.sendRawLineAndUser = sendRawLineAndUser;
module.exports.sendMessage = sendMessage;
