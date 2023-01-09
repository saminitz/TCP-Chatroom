const global = require('./global');
const user = require('./user');

function echoToAllSockets(socket, message) {
  let username = user.getUsername(socket);
  for (let i = 0; i < global.allSockets.length; i++) {
    if (global.allSockets[i].socket != socket) {
      global.allSockets[i].socket.write(
        '\r' + user.usernameAndSpacing(username)
        + message + '\r\n'
        + user.usernameAndSpacing(global.allSockets[i].username));
    }
  }
  socket.write(user.usernameAndSpacing(username));
}

function usernamePreview(socket) {
  socket.write("\r" + user.usernameAndSpacing(user.getUsername(socket)) + ": ");
}

function sendRawLine(socket, text) {
  socket.write("\r" + text + "\r\n");
  usernamePreview(socket); // is it useful here?
}

function sendMessage(socket) {
  socket.write("\r" + user.usernameAndSpacing(user.getUsername(socket)) + ": " + text + "\r\n");
  usernamePreview(socket);
}

module.exports.echoToAllSockets = echoToAllSockets;
module.exports.usernamePreview = usernamePreview;
module.exports.sendRawLine = sendRawLine;
module.exports.sendMessage = sendMessage;
