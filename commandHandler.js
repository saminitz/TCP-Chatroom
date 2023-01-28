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
    "alias": ["list", "online"],
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
  },

  "msg": {
    "alias": ["pm"],
    "run": (socket, msg) => {
      if (msg.length > 0 && msg.indexOf(' ') != -1) {
        let receiverUsername = msg.substring(0, msg.indexOf(' '));
        let message = msg.substring(receiverUsername.length + 1);
        let receiverConnection = global.getConnection(receiverUsername)
        if (receiverConnection == undefined) {
          messaging.sendRawLineAndUser(socket, "Benutzer nicht gefunden. Überprüfe mit /list welche Nutzer verfügbar sind");
          return;
        }

        messaging.sendDirectMessage(socket, receiverConnection.socket, message);
        messaging.usernamePreview(socket);
      }
    },
    "usage": "/msg <Username> <Nachricht>",
    "man": "Mit msg können Nachrichten an einzelne Benutzer geschickt werden."
  },
  "clear": {
    "run": (socket) => {
      messaging.sendRawLineAndUser(socket, '\x1B[1;1H\x1B[2J');
    },
    "usage": "/clear",
    "man": "Mit clear wird das gesamte Konsolen Fenster aufgeräumt"
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

function initializeCommandAliases() {
  for (const [command, values] of Object.entries(commands)) {
    if ('alias' in values) {
      values.alias.forEach(element => commands[element] = commands[command]);
    }
  }
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

initializeCommandAliases();

module.exports.query = query;
