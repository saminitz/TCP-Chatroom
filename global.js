let allConnections = [];

function getConnection(socket) {
  return allConnections.find(obj => {
    return obj.socket == socket;
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
