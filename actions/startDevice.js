module.exports = (db, config, request) => {
  // action only to facilitate regiter of devices when find it
  return (id, ip) => {
    const uuid = require('uuid/v5');
    // To each device call put rele to turn off the port
    const ports = ['r0', 'r1', 'r2', 'r3'].map(item => {
      return {
        _id: uuid(item, id),
        state: false,
        location: config.default.location,
        name: item,
        type: (config.topic || '') + 'toggle',
        topic: 'switch'
      }
    });
    return Promise.all([
      db.insertDevice({ _id: id, active: true }),
      db.insertPort(ports)
    ]);
  }
}