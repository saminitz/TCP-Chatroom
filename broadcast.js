const global = require('./global');
const user = require('./user');

function echoToAllSockets(socket, message) {
  let username = user.getUsername(socket);
  for (let socketItem of global.allSockets) {
    if (socketItem.socket != socket) {
      sendMessage(socketItem,message);
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
