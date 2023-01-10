const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const server = require('./server');
const messaging = require('./messaging');

const commands = {
  "rename": {
    "run": (socket, username) => {
      if (username.length > 0) {
        let oldUsername = user.getUsername(socket);
        user.setUsername(global.getConnection(socket), username, true);
        messaging.broadcastRaw(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + ' umbenannt');
      }
    },
    "usage": "/rename name",
    "man": "Mit rename kann der Benutzername geändert werden, dabei werden alle Leerzeichen und Umbrüche entfernt."
  }
}

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.substr(1).split(' ')[0];
  let parameter = message.substr(command.length + 1);

  if (commands[command] == undefined) {
    messaging.sendRawLineAndUser(socket, "Command invalid");
  } else {
    commands[command].run(socket, parameter);
  }

  // switch (command[0].toLowerCase()) {
  //   case '/rename':

  //     break;

  //   case '/users':
  //   case '/list':
  //     usernames = []
  //     for (const socketItem of global.allConnections) {
  //       usernames.push(socketItem.username);
  //     }
  //     messaging.sendRawLineAndUser(socket, "Currently connected users are: " + usernames.join(", ") + "\r\n");
  //     break;

  //   case '/logout':
  //     server.closeSocketConnection(socket);
  //     break;

  //   case '/help':
  //     messaging.sendRawLine(
  //       ''
  //     )
  //     break;

  //   default:
  //     break;
  // }

  throw new customError.StopParent('command')
}

module.exports.query = query;
