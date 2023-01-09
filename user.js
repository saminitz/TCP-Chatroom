const global = require('./global');
const customError = require('./customErrors');
const { broadcastMessage } = require('./broadcast');

let longestUsername = 0;

function setUsernameIfNotDefined(socket, username) {
  if (global.connectionExits(socket)) {
    return;
  }
  let item = { socket: socket };
  setUsername(item, username);
  global.allConnections.push(item);
  broadcastMessage(socket, getUsername(socket) + ' ist dem Chat beigetreten');
  throw new customError.StopParent('username');
}

function setUsername(connection, username) {
  connection.username = username.trim().replace(/\r|\n|\ /g, '');
  longestUsername = connection.username.length > longestUsername ? connection.username.length : longestUsername;
  connection.socket.write('Benutzername erfolgreich gesetzt: ' + connection.username + '\r\n\r\n');
}

function getUsername(socket) {
  return global.allConnections.find(obj => {
    return obj.socket == socket;
  }).username;
}

function usernameAndSpacing(username) {
  let fillLength = longestUsername - username.length;
  return ' '.repeat(fillLength) + username + ' - ';
}

module.exports.setUsernameIfNotDefined = setUsernameIfNotDefined;
module.exports.setUsername = setUsername;
module.exports.getUsername = getUsername;
module.exports.usernameAndSpacing = usernameAndSpacing;
