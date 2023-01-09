let allSockets = [];

function allSocketsItem(socket) {
  return allSockets.find(obj => {
    return obj.socket == socket;
  });
}

function allSocketsItemExists(socket) {
  return allSockets.some(obj => {
    return obj.socket == socket;
  });
}

module.exports.allSockets = allSockets;
module.exports.allSocketsItem = allSocketsItem;
module.exports.allSocketsItemExists = allSocketsItemExists;