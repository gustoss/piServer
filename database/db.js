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
    // Methods for device
    findDevice: (uuidDevice) => {
      return new Promise((resolve, reject) => {
        if (!uuidDevice || typeof uuidDevice !== 'string') return reject('UUID must be passed!');
        db.device.findOne({ _id: uuidDevice }, (err, doc) => {
          if (err) return reject(err);
          resolve(doc);
        });
      });
    },
    insertDevice: (obj) => {
      return new Promise((resolve, reject) => {
        if (!obj._id) return reject('_id must be passed to save!');
        db.device.insert(obj, (err, nDoc) => {
          if (err) return reject(err);
          resolve();
        });
      });
    },
    updateDevice: (uuidDevice, obj) => { // Maybe I don't use it
      return new Promise((resolve, reject) => {
        if (!uuidDevice || typeof uuidDevice !== 'string') return reject('UUID must be passed!');
        db.device.update({ _id: uuidDevice }, obj, {}, err => {
          if (err) return reject(err);
          db.device.persistence.compactDatafile();
          resolve();
        });
      });
    },
    // Methods for device's ports
    insertPort: (obj) => {
      return new Promise((resolve, reject) => {
        if (obj) {
          // if (typeof obj.isArray === 'undefined') obj = [obj]; // I will have back this validation, but right, if obj === 'object' transform to array
          for (const item of obj)
            if (!item._id) return reject('_id must be passed to save!');
          db.port.insert(obj, (err, nDoc) => {
            if (err) return reject(err);
            resolve();
          });
        }
      });
    },
    findPort: (uuidPort) => {
      return new Promise((resolve, reject) => {
        if (!uuidPort || typeof uuidPort !== 'string') return reject('UUID must be passed!');
        db.port.findOne({ _id: uuidPort }, (err, doc) => {
          if (err) return reject(err);
          resolve(doc);
        });
      });
    },
    allPorts: () => {
      return new Promise((resolve, reject) => {
        db.port.find({}, (err, docs) => {
          if (err) return reject(err);
          resolve(docs);
        });
      });
    },
    updatePort: (uuidPort, obj) => {
      return new Promise((resolve, reject) => {
        if (!uuidPort || typeof uuidPort !== 'string') return reject('UUID must be passed!');
        db.port.update({ _id: uuidPort }, { $set: obj }, {}, err => {
          if (err) return reject(err);
          db.port.persistence.compactDatafile();
          resolve();
        });
      });
    }
  };
}