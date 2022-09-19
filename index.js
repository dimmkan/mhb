const bootstrap = require('infrastructure/config/bootstrap');
const server = require('infrastructure/http/server');
const serviceLocator = require('infrastructure/config/service-locator');

// Start the server
const start = async () => {
  try {
    await bootstrap.init(serviceLocator);
    await server.start();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

start();
