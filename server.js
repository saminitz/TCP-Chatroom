const net = require('net');
let allSockets = [];

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

function setUsername(socket, data, replaceUserName = false) {
  let item = allSockets.find(obj => {
    return obj.socket == socket;
  });
  if (item != undefined && (item.username == undefined || replaceUserName)) {
    item.username = data.toString('ascii').trim().replace('\r', '').replace('\n', '').replace(/ /g, '')
    socket.write('Benutzername erfolgreich gesetzt: ' + item.username + '\r\n\r\n');
    throw new StopParent('username');
  }
}

function commandHandler(socket, data) {
  let message = data.toString('ascii');
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

function echoToAllSocketsExceptSender(socket, data) {
  let username = allSockets.find(obj => {
    return obj.socket == socket;
  }).username;
  for (let i = 0; i < allSockets.length; i++) {
    if (allSockets[i].socket != socket) {
      allSockets[i].socket.write(username + ': ' + data.toString('ascii'));
    }
  }
}

function createServer() {
  var server = net.createServer(function (socket) {
    // color code red \x1b\[31m 
    socket.write('Globaler Group Chat\r\n!!! Achtung nicht verschlüsselt !!!\r\n\r\nBenutzernamen eingeben:\r\n');

    allSockets.push({socket: socket});

    socket.on('data', function (data) {
      try {
        setUsername(socket, data);
        commandHandler(socket, data);
        echoToAllSocketsExceptSender(socket, data);
      } catch (error) {
        if (!(error instanceof StopParent)) {
          throw error;
        }
      }
    })

    socket.on('error', function(){
      let item = allSockets.find(obj => {
        return obj.socket == socket;
      })
      allSockets.splice(allSockets.indexOf(item), 1);
    })
  });

  server.listen(1337, '0.0.0.0');
}

createServer();