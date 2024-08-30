const dht11 = require('./dht11');
const device =require('./device')
const routes = (app) => {
  app.use('/api/data', dht11)
  app.use('/api/data', device)
}
module.exports = routes