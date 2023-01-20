let allConnections = [];

function getConnection(identifier) {
  return allConnections.find(obj => {
    return obj.socket == identifier || obj.username == identifier;
  });
}

function connectionExits(socket) {
  return allConnections.some(obj => {
    return obj.socket == socket;
  });
}

module.exports.allConnections = allConnections;
module.exports.getConnection = getConnection;
module.exports.connectionExits = connectionExits;
