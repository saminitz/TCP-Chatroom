const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const miscellaneous = require('./miscellaneous');

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
