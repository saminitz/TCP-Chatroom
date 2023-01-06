const net = require('net');
let allSockets = [];
let longestUsername = 0;

class StopParent extends Error {
  constructor(message) {
    super(message)
  }
}

String.prototype.title = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

function setUsernameIfNotDefined(socket, username) {
  let item = allSockets.some(obj => {
    return obj.socket == socket;
  });
  if (item) {
    return;
  }
  allSockets.push({ socket: socket });
  setUsername(socket, username);
}

function setUsername(socket, username) {
  let item = allSockets.find(obj => {
    return obj.socket == socket;
  });
  item.username = username.trim().replace('\r', '').replace('\n', '').replace(/ /g, '')
  longestUsername = item.username.length > longestUsername ? item.username.length : longestUsername;
  socket.write('Benutzername erfolgreich gesetzt: ' + item.username + '\r\n\r\n');
  throw new StopParent('username');
}

function commandHandler(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  let command = message.split(' ')[0];
  switch (command) {
    case '/rename':
      setUsername(socket, message.substr(command.length + 1), true);
      break;

    default:
      break;
  }

  throw new StopParent('command')
}

function usernameAndSpacing(username) {
  let fillLength = longestUsername - username.length;
  return ' '.repeat(fillLength) + username + ' - ';
}

function echoToAllSockets(socket, data) {
  let username = allSockets.find(obj => {
    return obj.socket == socket;
  }).username;
  for (let i = 0; i < allSockets.length; i++) {
    if (allSockets[i].socket != socket) {
      allSockets[i].socket.write(
        '\r' + usernameAndSpacing(username)
        + data
        + usernameAndSpacing(allSockets[i].username));
    }
  }
  socket.write(usernameAndSpacing(username));
}

function createServer() {
  var server = net.createServer(function (socket) {
    socket.setEncoding('utf8');
    // color code red \x1b\[31m 
    socket.write('Globaler Group Chat\r\n!!! Achtung nicht verschlüsselt !!!\r\n\r\nBenutzernamen eingeben:\r\n');

    socket.on('data', function (data) {
      try {
        setUsernameIfNotDefined(socket, data);
        commandHandler(socket, data);
        echoToAllSockets(socket, data);
      } catch (error) {
        if (!(error instanceof StopParent)) {
          throw error;
        }
      }
    })

    socket.on('error', function () {
      let item = allSockets.find(obj => {
        return obj.socket == socket;
      })
      allSockets.splice(allSockets.indexOf(item), 1);
    })
  });

  server.listen(1337, '0.0.0.0');
}

createServer();