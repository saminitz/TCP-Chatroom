const global = require('./global');
const messaging = require('./messaging');

let longestUsername = 0;

function setNewUser(socket, username) {
  let item = { socket: socket, username: 'newUser' };
  global.allConnections.push(item);
  setUsername(item, username);
  messaging.broadcastRaw(socket, getUsername(socket) + ' ist dem Chat beigetreten');
}

function setUsername(connection, username) {
  connection.username = username.trim().replace(/\r|\n|\ /g, '');
  updateLongestUsername();
  messaging.sendRawLineAndUser(connection.socket, 'Benutzername erfolgreich gesetzt: ' + connection.username);
}

function getUsername(socket) {
  return global.getConnection(socket).username;
}

function getSpacing(text, additional = 2) {
  let fill = longestUsername + additional - text.length;
  return ' '.repeat(fill > 0 ? fill : 0);
}

function usernameAndSpacing(username) {
  return getSpacing(username, 0) + username;
}

function updateLongestUsername() {
  longestUsername = 0;
  global.allConnections.forEach(connection => {
    longestUsername = connection.username.length > longestUsername ? connection.username.length : longestUsername;
  });
}

module.exports.setNewUser = setNewUser;
module.exports.setUsername = setUsername;
module.exports.getUsername = getUsername;
module.exports.getSpacing = getSpacing;
module.exports.usernameAndSpacing = usernameAndSpacing;
module.exports.updateLongestUsername = updateLongestUsername;
