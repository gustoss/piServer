module.exports = (db, validation) => {
  return [{
    method: 'patch',
    path: '/device/:id',
    handler: async (request, replay) => {
      let obj = undefined;
      let id = undefined;
      try {
        id = (await validation(request.params, { id: /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/ })).id;
        obj = await validation(request.body, {
          location: /^[a-zA-Z\d\s]+$/,
          name: /^[a-zA-Z\d\s]+$/,
          topic: /^switch|together$/
        });
        if (request.body.together) {
          obj.topic = 'together';
          obj.together = request.body.together.map(item => {
            return validation(item, /^[0-9a-f]{8}\-([0-9a-f]{4}\-){3}[0-9a-f]{12}$/, 'Validation error in field together.id!');
          });
          obj.together = await Promise.all(obj.together);
          let promises = [];
          for (const item in obj.together) {
            let other = {
              together: obj.together.map(it => it),
              topic: 'together'
            };
            other.together.splice(item, 1, id);
            promises.push(db.updatePort(item, other));
          }
          await Promise.all(promises);
        }
      } catch (err) {
        console.log(err);
        replay.code(400).send(err);
      }

      if (obj && id) {
        try {
          db.updatePort(id, obj);
          replay.code(204);
        } catch (err) {
          console.log(err);
          replay.code(500).send('Internal error!');
        }
      } else replay.code(400);
    }
  }];
}