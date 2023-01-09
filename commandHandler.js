const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const miscellaneous = require('./miscellaneous');
const broadcast = require('./broadcast');

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.split(' ')[0];
  switch (command) {
    case '/rename':
      if (message.length > '/rename'.length + 1){ 
        let oldUsername = user.getUsername(socket);
        user.setUsername(global.allSocketsItem(socket), message.substr(command.length + 1), true);
        broadcast.echoToAllSockets(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + 'umbenannt');
      }
      break;

    case '/users':
    case '/list':
      usernames = []
      for (const mySocket of global.allSockets) {
        usernames.push(mySocket.username);
      }
      socket.write("\rCurrently connected users are: " + usernames.join(", ") + "\r\n" + user.usernameAndSpacing(user.getUsername(socket)) + "\r\n");
      break;

    case '/logout':
      miscellaneous.closeSocketConnection(socket);
      break;

    default:
      break;
  }

  throw new customError.StopParent('command')
}

module.exports.query = query;
