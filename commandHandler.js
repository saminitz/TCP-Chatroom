const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const miscellaneous = require('./miscellaneous');
const { echoToAllSockets } = require('./broadcast');

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.split(' ')[0];
  switch (command) {
    case '/rename':
      if (message.length > '/rename'.length + 1){ 
        let oldUsername = user.getUsername();
        user.setUsername(socket, message.substr(command.length + 1), true);
        echoToAllSockets(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + 'umbenannt');
      }
      break;

    case '/users':
    case '/list':
      usernames = []
      for (const mysocket of global.allSockets) {
        usernames.push(mysocket.username);
      }
      socket.write("\rCurrently connected users are: " + usernames.join(", ") + user.usernameAndSpacing(username)+"\r\n");
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
