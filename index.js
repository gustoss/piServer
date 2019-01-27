const fastify = require('fastify');
const server = fastify({ logger: true });
const mdns = require('mdns');
const awilix = require('awilix');
const { asValue, asFunction, Lifetime, InjectionMode } = awilix;
const request = require('request');
const container = awilix.createContainer({
  injectionMode: InjectionMode.PROXY
});

container.register('config', asValue(require('./config.js')));
// Instead use direct request module in DI, create a function to use and setup some configuration like OTP
container.register('request', asFunction(() => {
  return (opts) => {
    return new Promise((resolve, reject) => {
      if (opts.body && typeof opts === 'object') 
        opts.body = JSON.stringify(opts.body);
      request(opts, (err, response, body) => {
        if (err) reject(err);
        else {
          if (response && /^2[0-9]{2}$/.test(response.statusCode)) resolve(body);
          else reject({
            statusCode: response.statusCode,
            body: response.body
          })
        }
      });
    });
  };
}, { injectionMode: InjectionMode.CLASSIC, lifetime: Lifetime.SINGLETON }));

// Configure mdns to find all devices in network
const browser = mdns.createBrowser(mdns.tcp('http'), {
  resolverSequence: [
    mdns.rst.DNSServiceResolve(),
    mdns.rst.getaddrinfo({ families: [4] })
  ]
});

let valueRegister = {
  mdns: asValue(browser),
  db: asFunction(require('./database/db'), { injectionMode: InjectionMode.CLASSIC, lifetime: Lifetime.SINGLETON }),
  validation: asFunction(require('./validation.js'), { injectionMode: InjectionMode.CLASSIC, lifetime: Lifetime.SINGLETON })
}

container.register(valueRegister);

// Action to control all application
container.loadModules(['actions/**/*.js'], {
  resolverOptions: {
    lifetime: Lifetime.SINGLETON,
    injectionMode: InjectionMode.CLASSIC
  },
  formatName: 'camelCase'
});

// Load all routes in folder ./route
require('./loadRoutes')({
  server, // Server to register route
  path: 'routes/', // Path of folder where there are all routes
  container, // Container where there are all dependency to inject
  mode: { injectionMode: InjectionMode.CLASSIC }, // Mode that will inject all routes
  basePath: container.resolve('config').basePath || '' // Base URL of all routes loaded
});

// Some actions have to be resolve when application start up, put name of file in ./containerConfig.json
const containerConf = container.resolve('config');
for (const item of containerConf.register) {
  container.resolve(item);
}

// Start up the application
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