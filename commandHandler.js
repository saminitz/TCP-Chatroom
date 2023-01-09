const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.split(' ')[0];
  switch (command) {
    case '/rename':
      if (message.length > '/rename'.length + 1)
        user.setUsername(socket, message.substr(command.length + 1), true);
      break;

    case '/users':
    case '/list':
      usernames = []
      for (const mysocket of global.allSockets) {
        usernames.push(mysocket.username);
      }
      socket.write("\rCurrently connected users are: " + usernames.join(", ") + user.usernameAndSpacing(username)+"\r\n");
      break;

    default:
      break;
  }

  throw new customError.StopParent('command')
}

module.exports.query = query;
