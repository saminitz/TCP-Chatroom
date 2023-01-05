const net = require('net');
let allSockets = [];

String.prototype.title = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

function setUsernameIfNotDefined(socket, data) {
  let hasNoUsername = allSockets.find(obj => {
    return obj.socket == socket;
  }) == undefined;
  if (hasNoUsername) {
    let allSocketsElement = {
      socket: socket,
      username: data.toString('ascii').replace('\r', '').replace('\n', '').title().replace(/ /g, '')
    }
    allSockets.push(allSocketsElement);
    socket.write('Benutzername erfolgreich gesetzt: ' + allSocketsElement.username + '\r\n\r\n');

    new Error('Only setting username');
  }
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
    socket.write('Globaler Group Chat\r\n!!! Achtung nicht verschlüsselt !!!\r\n\r\nBenutzernamen eingeben:\r\n');
    //socket.pipe(socket);

    socket.on('data', function (data) {
      try {
        setUsernameIfNotDefined(socket, data);
        echoToAllSocketsExceptSender(socket, data);
      } catch (error) {
        
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