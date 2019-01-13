const fastify = require('fastify');
const server = fastify({ logger: true });
const mdns = require('mdns');
const awilix = require('awilix');
const { asValue, asFunction, Lifetime, InjectionMode } = awilix;
const request = require('request');
const container = awilix.createContainer({
  injectionMode: InjectionMode.PROXY
});

container.register('config', asValue(require('./config.json')));
container.register('request', asFunction(() => {
  return (opts) => {
    return new Promise((resolve, reject) => {
      request(opts, (err, response, body) => {
        if (err) reject(err);
        else {
          if (response && /^2[0-9]{2}$/.test(response.statusCode)) resolve(body);
          else reject(response)
        }
      });
    });
  };
}, { injectionMode: InjectionMode.CLASSIC }));

container.register('db', asFunction(require('./database/db'), { injectionMode: InjectionMode.CLASSIC }));
container.resolve('db');

container.loadModules(['actions/**/*.js'], {
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.CLASSIC
  },
  formatName: 'camelCase'
});

require('./loadRoutes')({
  server,
  path: 'routes/',
  opts: container,
  basePath: '/api/v1'
});

const browser = mdns.createBrowser(mdns.tcp('http'), {
  resolverSequence: [
    mdns.rst.DNSServiceResolve(),
    mdns.rst.getaddrinfo({ families: [4] })
  ]
});

let valueRegister = {
  mdns: asValue(browser)
}

container.register(valueRegister);

const containerConf = require('./containerConf.json');
for (const item of containerConf.register) {
  container.resolve(item);
}

const start = async () => {
  try {
    await server.listen(8088);
  } catch (err) {
    console.log('Server isn\'t running!')
    process.exit(1);
  }
  try {
    await browser.start();
  } catch (err) {
    console.log('MDNS isn\'t running!')
    process.exit(1);
  }
}
start();