module.exports = (mdns, db, request) => {
  console.log(':)')
  mdns.on('serviceUp', async service => {
    console.log('serviceUp', service);
    if (service.txtRecord && service.txtRecord.platform === 'devicePointSwitch') {
      if (!service.txtRecord.id) {
        const uuid = require('uuid/v5');
        const id = uuid('devicepointswitch.com', uuid.DNS);
        const body = undefined
        try {
          await request({
            uri: `http://${service.addresses[0]}:${service.port}/id`,
            method: 'PUT'
          });
        } catch (err) {
          console.log('ERRO!', err);
        }
        console.log(body);
        db.insertDevice({
          _id: id
        })
      }
    }
  });

  mdns.on('serviceDown', service => {
    console.log(service);
  });
}