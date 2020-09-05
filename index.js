const app = require('./app'); // The Express App itself
const http = require('http'); //Built in node module that allows for creation of web servers
const logger = require('./utils/logger'); //separate logging functions
const { PORT } = require('./utils/config');


const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
});