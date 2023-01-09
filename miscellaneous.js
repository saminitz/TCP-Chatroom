function closeSocketConnection(socket) {
  socket.destroy();
}

module.exports.closeSocketConnection = closeSocketConnection;