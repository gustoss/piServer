const test = {
  "dbConfig": {
    "device": {
      "filename": "/database/De.db",
      "autoload": true
    },
    "port": {
      "filename": "/database/Po.db",
      "autoload": true
    }
  },
  "register": ["registerDevice"],
  "basePath": "/api/v1",
  "baseTopic": "",
  "default": {
    "location": "Room"
  }
};

module.exports = test;