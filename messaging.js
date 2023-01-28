const global = require('./global');
const user = require('./user');

let allMessages = [];

function addMessageToHistory(message) {
  allMessages.push(message);
}

function getHistory(count) {
  if (count == -1 || count > allMessages.length) {
    return allMessages;
  } else {
    return allMessages.slice(allMessages.length - count);
  }
}

function sendHistory(socket) {
  clearScreen(socket);
  socket.write(getHistory(10).join(''));
}

function clearScreen(socket) {
  // First move the cursor to line 500 and column 1
  // and then clear the screen to the bottom of the console
  socket.write('\x1B[500;1H\x1B[2J');
}

function clearLine(socket) {
  socket.write('\x1B[2K');
}

function broadcast(socket, message) {
  for (let connection of global.allConnections) {
    sendMessage(connection.socket, user.getUsername(socket), message);
  }
}

function broadcastRaw(socket, text) {
  for (let connection of global.allConnections) {
    sendRawLineAndUser(connection.socket, text);
  }
}

function usernamePreview(socket) {
  clearLine(socket);
  socket.write(user.usernameAndSpacing(user.getUsername(socket)) + ": ");
}

// Todo: use ┃
function sendRawLine(socket, text) {
  clearLine(socket);
  socket.write(text + user.getSpacing(text) + "\r\n");
}

function sendRawLineAndUser(socket, text) {
  sendRawLine(socket, text);
  usernamePreview(socket);
}

function sendMessage(socket, senderName, text) {
  addMessageToHistory(user.usernameAndSpacing(senderName) + ": " + text + "\r\n");
  sendHistory(socket);
  usernamePreview(socket);
}

module.exports.clearScreen = clearScreen;
module.exports.getHistory = getHistory;
module.exports.broadcast = broadcast;
module.exports.broadcastRaw = broadcastRaw;
module.exports.sendRawLine = sendRawLine;
module.exports.sendRawLineAndUser = sendRawLineAndUser;
module.exports.sendMessage = sendMessage;
