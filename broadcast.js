const global = require('./global');
const user = require('./user');

function echoToAllSockets(socket, data) {
  let username = user.getUsername(socket);
  for (let i = 0; i < global.allSockets.length; i++) {
    if (global.allSockets[i].socket != socket) {
      global.allSockets[i].socket.write(
        '\r' + user.usernameAndSpacing(username)
        + data + '\r\n'
        + user.usernameAndSpacing(global.allSockets[i].username));
    }
  }
  socket.write(user.usernameAndSpacing(username));
}

module.exports.echoToAllSockets = echoToAllSockets;
