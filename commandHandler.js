const global = require('./global');
const user = require('./user');
const server = require('./server');
const messaging = require('./messaging');

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
      messaging.sendRawLineAndUser(socket, "Folgende Benutzer sind verbunden: " + usernames.join(", "));
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
        messaging.sendRawLineAndUser(socket, "Befehl '" + cmd + "' nicht gefunden");
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

  let cmdEnd = message.indexOf(' ');
  let command = message.substring(1,cmdEnd>1?cmdEnd:undefined);
  
  let parameter = message.substr(command.length + 1).trim(); // 1 for '/'

  if (commands[command] == undefined) {
    messaging.sendRawLineAndUser(socket, "Befehl ungültig");
  } else {
    commands[command].run(socket, parameter);
  }
}

module.exports.query = query;
