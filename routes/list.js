module.exports = (opts) => {
  return [
    {
      method: 'get',
      path: 'list/',
      handler: async (request, replay) => {
        return { hello: `world`};
      }
    }
  ]
}