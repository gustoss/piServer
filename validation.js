module.exports = () => {
  return (fields, valids, messages) => {
    return new Promise((resolve, reject) => {
      if(valids instanceof RegExp) {
        if (valids.test(fields)) return resolve(fields);
        return reject({
          value: fields,
          message: messages || `Validation error!`
        });
      }
      let ret = {};
      let err = [];
      for (const item in valids) {
        if (fields[item]) {
          if (valids[item].test(fields[item])) ret[item] = fields[item];
          else err.push({
            field: item,
            value: fields[item],
            message: messages && messages[item] || `Validation error in field ${item}!`
          });
        }
      }
      if (err.length > 0) return reject(err);
      resolve(ret);
    });
  };
}
