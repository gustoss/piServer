module.exports = (config) => {
  const Database = require('nedb');
  const path = require('path');

  for (const i in config.dbConfig) 
    if (config.dbConfig[i].filename) config.dbConfig[i].filename = path.join('./', config.dbConfig[i].filename)

  const db = {
    device: new Database(config.dbConfig.device),
    port: new Database(config.dbConfig.port)
  }

  // Compact file always in insert, update and delete
  return {
    findDevice: (uuidDevice) => {
      return new Promise((resolve, reject) => {
        if (!uuidDevice) return reject('UUID must be passed');
        db.device.findOne({ _id: uuidDevice }, (err, doc) => {
          if (err) return reject('Erro in DB!');
          resolve(doc);
        });
      });
    },
    insertDevice: (obj) => {
      return new Promise((resolve, reject) => {
        if (!obj._id) return reject('_id must be passed to save!');
        db.device.insert(obj, (err, nDoc) => {
          if (err) return reject('Erro in DB!');
          db.device.persistence.compactDatafile();
          resolve();
        });
      });
    }
  };
}