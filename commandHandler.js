const global = require('./global');
const user = require('./user');
const server = require('./server');
const messaging = require('./messaging');

const commands = {
  "help": {
    "run": (socket, cmd) => {
      if (cmd == '') {
        for (const key in commands) {
          messaging.sendRawLine(socket, commands[key].usage);
        }
        messaging.usernamePreview(socket);
        return;
      }
      if (commands[cmd] == undefined) {
        messaging.sendRawLineAndUser(socket, "Befehl '" + cmd + "' nicht gefunden");
        return;
      }
      messaging.sendRawLine(socket, commands[cmd]?.usage);
      messaging.sendRawLineAndUser(socket, commands[cmd]?.man);
    },
    "usage": "/help <Befehl>",
    "man": "Zeige Hilfe zu Befehlen an"
  },

  "rename": {
    "run": (socket, username) => {
      if (username.length > 0) {
        let oldUsername = user.getUsername(socket);
        user.setUsername(global.getConnection(socket), username);
        messaging.broadcastRaw(socket, oldUsername + ' hat sich zu ' + user.getUsername(socket) + ' umbenannt');
      } else {
        messaging.sendRawLineAndUser(socket, commands["rename"].usage);
      }
    },
    "usage": "/rename <Name>",
    "man": "Mit 'rename' kann der Benutzername geändert werden, dabei werden alle Leerzeichen und Umbrüche entfernt."
  },

  "users": {
    "run": (socket) => {
      let usernames = []
      global.allConnections.forEach(element => {
        usernames.push(element.username);
      });
      messaging.sendRawLineAndUser(socket, "Folgende Benutzer sind verbunden: " + usernames.join(", "));
    },
    "usage": "/users",
    "man": "Der Befehl 'users' listet alle aktiven Teilnehmer im Chat"
  },

  "logout": {
    "run": (socket, msg) => {
      global.getConnection(socket).goodbye = msg
      server.closeSocketConnection(socket);
    },
    "usage": "/logout <Nachricht>",
    "man": "Dieser Befehl beendet den Chat. Weiterer Text kann als Abschlusstext gesendet werden."
  }

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
  let command = message.substring(1, cmdEnd > 1 ? cmdEnd : undefined).toLowerCase();
  let parameter = message.substr(command.length + 1).trim(); // 1 for '/'

  if (commands[command] == undefined) {
    messaging.sendRawLineAndUser(socket, "Befehl ungültig");
  } else {
    commands[command].run(socket, parameter);
  }
}

module.exports.query = query;
