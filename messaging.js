const global = require('./global');
const user = require('./user');

function broadcast(socket, message) {
  let username = user.getUsername(socket);
  for (let connection of global.allConnections) {
    if (connection.socket != socket) {
      sendMessage(connection.socket, message);
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

function sendMessage(socket, text) {
  socket.write("\r" + user.usernameAndSpacing(user.getUsername(socket)) + ": " + text + "\r\n");
  usernamePreview(socket);
}

module.exports.broadcast = broadcast;
module.exports.usernamePreview = usernamePreview;
module.exports.sendRawLine = sendRawLine;
module.exports.sendMessage = sendMessage;
