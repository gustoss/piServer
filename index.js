const fastify = require('fastify');
const server = fastify({logger: true});

const schema = {
    querystring: {
        name: { type: 'string' }
    }
}

server.get('/', async (req, res) => {
    return { hello: `world ${req.query.name}`};
});

server.addHook('onSend', async (req, replay, payload) => {
    let newPay = payload.replace(/}$/, ',"otp":"000000"}');
    console.log(newPay);
    return newPay;
});

const start = async () => {
    try {
        await server.listen(8080);
    } catch (err) {
        process.exit(1);
    }
}
start();