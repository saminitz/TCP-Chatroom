const global = require('./global');
const customError = require('./customErrors');
const user = require('./user');
const server = require('./server');
const messaging = require('./messaging');
const { log } = require('console');

const commands = {
  "rename": {
    "run": (socket, username) => {
      if (username.length > 0) {
        let oldUsername = user.getUsername(socket);
        user.setUsername(global.getConnection(socket), username);
        messaging.broadcastRaw(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + ' umbenannt');
      }
    },
    "usage": "/rename <Name>",
    "man": "Mit 'rename' kann der Benutzername geändert werden, dabei werden alle Leerzeichen und Umbrüche entfernt."
  },

  "users": {
    "run": (socket) => {
      usernames = []
      global.allConnections.forEach(element => {
        usernames.push(element.username);
      });
      messaging.sendRawLineAndUser(socket, "Currently connected users are: " + usernames.join(", "));
    },
    "usage": "/users",
    "man": "Der Befehl 'users' listet alle aktiven Teilnehmer im Chat"
  },
  "logout": {
    "run": (socket, msg)=>{
      global.getConnection(socket).goodbye = msg
      server.closeSocketConnection(socket);
    },
    "usage": "/logout <Nachricht>",
    "man": "Dieser Befehl beendet den Chat. Weiterer Text kann als Abschlusstext gesendet werden."
  },
  "help": {
    "run": (socket, cmd)=>{
      if (cmd == 'all') {
        commands.forEach(element => {
          messaging.sendRawLine(socket, commands[element].usage);
          messaging.sendRawLineAndUser(socket, commands[element].man);
        });
        return;
      }
      cmd = cmd!=''?cmd:'help';
      if (commands[cmd] == undefined) {
        messaging.sendRawLineAndUser(socket, "Command '" + cmd + "' not found");
        return;
      }
      messaging.sendRawLine(socket, commands[cmd]?.usage);
      messaging.sendRawLineAndUser(socket, commands[cmd]?.man);
    },
    "usage": "/help <Befehl>/all",
    "man": "Zeige Hilfe zu Befehlen an"
  },
  /*
  "users": {
    "run": (socket, appendix)=>{

    },
    "usage": "",
    "man": ""
  },
  */
}

function query(socket, message) {
  if (!message.startsWith('/')) {
    return;
  }

  // let command = message.substr(1).split(' ')[0];
  let cmdend = message.indexOf(' ');
  let command = message.substring(1,cmdend>1?cmdend:undefined);
  
  let parameter = message.substr(command.length + 1).trim(); // 1 for '/'

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
