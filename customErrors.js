class StopParent extends Error {
  constructor(message) {
    super(message)
  }
}

module.exports.StopParent = StopParent;