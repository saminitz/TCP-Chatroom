const global = require('./global');
const user = require('./user');

function echoToAllSockets(socket, data) {
  let username = global.allSockets.find(obj => {
    return obj.socket == socket;
  }).username;
  for (let i = 0; i < global.allSockets.length; i++) {
    if (global.allSockets[i].socket != socket) {
      global.allSockets[i].socket.write(
        '\r' + user.usernameAndSpacing(username)
        + data
        + user.usernameAndSpacing(global.allSockets[i].username));
    }
  }
  socket.write(user.usernameAndSpacing(username));
}

module.exports.echoToAllSockets = echoToAllSockets;