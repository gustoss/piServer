module.exports = (db) => {
  return [{
    method: 'get',
    path: '/device/list',
    handler: async (request, replay) => { // Add pagination
      let devices = undefined;
      try {
        devices = (await db.allPorts()).map((item) => {
          return {
            id: item._id,
            state: item.state,
            location: item.location,
            name: item.name,
            topic: item.topic
          }
        });
        replay.send(devices);
      } catch (err) {
        console.log(err);
        replay.code(500).send('Internal error!');
      }
    }
  }, {
    method: 'get',
    path: '/device/:id',
    handler: async (request, replay) => {
      let device = undefined;
      try {
        device = await db.findPort(request.params.id);
      } catch (err) {
        delete device;
        console.log(err);
        replay.code(500).send('Internal error!');
      }
      if (device) {
        replay.send({
          id: device._id,
          state: device.state,
          location: device.location,
          name: device.name,
          topic: item.topic
        });
      } else {
        replay.code(404).send('Device not found!');
      }
    }
  }]
}
