const customError = require('./customErrors');
const user = require('./user')

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.split(' ')[0];
  switch (command) {
    case '/rename':
      user.setUsername(socket, message.substr(command.length + 1), true);
      break;

    default:
      break;
  }

  throw new customError.StopParent('command')
}

module.exports.query = query;