module.exports = (mdns, db, request, startDevice) => {
  // Listen the MDns to find all devices in network and save with IP and give id for your ports
  mdns.on('serviceUp', async service => {
    if (service.txtRecord && service.txtRecord.platform === 'devicePointSwitch') {
      console.log(`\t***** DevicePointSwith find ${service.txtRecord.id}:${service.addresses[0]} *****`)
      if (!service.txtRecord.id) {
        const uuid = require('uuid/v5');
        const id = uuid('devicepointswitch.com', uuid.DNS); // Verify a way to change it
        try {
          startDevice(id);
        } catch (err) {
          console.log('ERRO!', err);
        }
      } else {
        const device = await db.findDevice(service.txtRecord.id);
        try {
          if (!device) {
            await startDevice(service.txtRecord.id);
          }
        } catch (err) {
          console.log('ERRO!', err);
        }
      }
    }
  });
  // Maybe remover this method
  mdns.on('serviceDown', service => {
    console.log('serviceDown', service);
  });
}