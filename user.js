const global = require('./global');
const customError = require('./customErrors');

let longestUsername = 0;

function setUsernameIfNotDefined(socket, username) {
  let item = global.allSockets.some(obj => {
    return obj.socket == socket;
  });
  if (item) {
    return;
  }
  global.allSockets.push({ socket: socket });
  setUsername(socket, username);
}

function setUsername(socket, username) {
  let item = global.allSockets.find(obj => {
    return obj.socket == socket;
  });
  item.username = username.trim().replace('\r', '').replace('\n', '').replace(/ /g, '')
  longestUsername = item.username.length > longestUsername ? item.username.length : longestUsername;
  socket.write('Benutzername erfolgreich gesetzt: ' + item.username + '\r\n\r\n');
  throw new customError.StopParent('username');
}

function usernameAndSpacing(username) {
  let fillLength = longestUsername - username.length;
  return ' '.repeat(fillLength) + username + ' - ';
}

module.exports.setUsernameIfNotDefined = setUsernameIfNotDefined;
module.exports.setUsername = setUsername;
module.exports.usernameAndSpacing = usernameAndSpacing;