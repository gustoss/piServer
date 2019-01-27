module.exports = (opts) => {
  const fs = require('fs');
  const path = require('path');
  const methods = {
    get: (p, h) => opts.server.get(p, h),
    head: (p, h) => opts.server.head(p, h),
    post: (p, h) => opts.server.post(p, h),
    put: (p, h) => opts.server.put(p, h),
    delete: (p, h) => opts.server.delete(p, h),
    optsions: (p, h) => opts.server.optsions(p, h),
    patch: (p, h) => opts.server.patch(p, h)
  }
  opts.basePath = opts.basePath || '';
  if (fs.existsSync(path.join(__dirname, opts.path))) {
    const files = fs.readdirSync(path.join(__dirname, opts.path));
    for (const item of files) {
      const stat = fs.statSync(path.join(__dirname, opts.path, item));
      if (stat.isFile() && /\.js$/.test(item)) {
        const fns = opts.container.build(require(path.join(__dirname, opts.path, item)), opts.mode);
        for (let i in fns) {
          const p = fns[i];
          methods[p.method.toLowerCase()](opts.basePath + p.path, p.handler);
        }
      }
    }
  } 
}