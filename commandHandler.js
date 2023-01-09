const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const server = require('./server');
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
        user.setUsername(global.getConnection(socket), message.substr(command.length + 1), true);
        broadcast.broadcastMessage(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + ' umbenannt');
      }
      break;

    case '/users':
    case '/list':
      usernames = []
      for (const socketItem of global.allConnections) {
        usernames.push(socketItem.username);
      }
      socket.write("\rCurrently connected users are: " + usernames.join(", ") + "\r\n" + user.usernameAndSpacing(user.getUsername(socket)) + "\r\n");
      break;

    case '/logout':
      server.closeSocketConnection(socket);
      break;

    default:
      break;
  }

  throw new customError.StopParent('command')
}

module.exports.query = query;
