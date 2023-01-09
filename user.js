const global = require('./global');
const customError = require('./customErrors');
const { echoToAllSockets } = require('./broadcast');

let longestUsername = 0;

function setUsernameIfNotDefined(socket, username) {
  if (global.allSocketsItemExists(socket)) {
    return;
  }
  let item = { socket: socket };
  setUsername(item, username);
  global.allSockets.push(item);
  echoToAllSockets(socket, getUsername(socket) + ' ist dem Chat beigetreten');
  throw new customError.StopParent('username');
}

function setUsername(allSocketItem, username) {
  allSocketItem.username = username.trim().replace(/\r|\n|\ /g, '');
  longestUsername = allSocketItem.username.length > longestUsername ? allSocketItem.username.length : longestUsername;
  allSocketItem.socket.write('Benutzername erfolgreich gesetzt: ' + allSocketItem.username + '\r\n\r\n');
}

function getUsername(socket) {
  return global.allSockets.find(obj => {
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
