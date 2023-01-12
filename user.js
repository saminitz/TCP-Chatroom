const global = require('./global');
const customError = require('./customErrors');
const messaging = require('./messaging');

let longestUsername = 0;

function setUsernameIfNotDefined(socket, username) {
  if (global.connectionExits(socket)) {
    return;
  }
  let item = { socket: socket, username: 'newUser' };
  global.allConnections.push(item);
  setUsername(item, username);
  messaging.broadcastRaw(socket, getUsername(socket) + ' ist dem Chat beigetreten');
  throw new customError.StopParent('username');
}

function setUsername(connection, username) {
  connection.username = username.trim().replace(/\r|\n|\ /g, '');
  updateLongestUsername();
  messaging.sendRawLineAndUser(connection.socket, 'Benutzername erfolgreich gesetzt: ' + connection.username);
}

function getUsername(socket) {
  return global.allConnections.find(obj => {
    return obj.socket == socket;
  }).username;
}

function getSpacing(text, additional=2){
  let fill = longestUsername + additional -  text.length;
  return ' '.repeat(fill>0?fill:0);
}

function usernameAndSpacing(username) {
  // let fillLength = longestUsername - username.length;
  // return ' '.repeat(fillLength) + username;
  return getSpacing(username,0) + username;
}

function updateLongestUsername() {
  longestUsername = 0;
  for (const connection of global.allConnections) {
    longestUsername = connection.username.length > longestUsername ? connection.username.length : longestUsername;
  }
}

module.exports.setUsernameIfNotDefined = setUsernameIfNotDefined;
module.exports.setUsername = setUsername;
module.exports.getUsername = getUsername;
module.exports.getSpacing = getSpacing;
module.exports.usernameAndSpacing = usernameAndSpacing;
module.exports.updateLongestUsername = updateLongestUsername;
