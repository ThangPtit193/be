const dht11 = require('./dht11');
const device = require('./device');
const historyAction = require('./historyAction');
const routes = (app) => {
  app.use('/api/data', dht11)
  app.use('/api/data', device)
  app.use('/api/data', historyAction)
}
module.exports = routes