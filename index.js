const fastify = require('fastify');
const server = fastify({ logger: true });
const mdns = require('mdns');
const browser = mdns.createBrowser(mdns.tcp('http'), {
  resolverSequence: [
    mdns.rst.DNSServiceResolve(),
    mdns.rst.getaddrinfo({ families: [4] })
  ]
});

browser.on('serviceUp', service => {
  console.log(service);
});

browser.on('serviceDown', service => {
  console.log(service);
});

server.get('/', async (request, replay) => {
  console.log(request.context)
  return { hello: `world ${request.query.name}` };
});

server.addHook('onRequest', async (request, replay) => {
  request.context = {
    message: 'Olá!'
  }
  return request;
});

server.addHook('onSend', async (request, replay, payload) => {
  let newPay = payload.replace(/^{/, '{"otp":"000000",');
  console.log(newPay);
  return newPay;
});

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