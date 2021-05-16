const express = require('express');
var bodyParser = require('body-parser');

//import routes from './routes';

class Apilogger {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(bodyParser.urlencoded({ extended: false }));
    this.server.use(bodyParser.json());
  }

  routes() {
    this.server.post('/pot-data', (req, res, next) => {
      console.log(req.body);
      return res.send('ok');
    });
    // this.server.use(routes);
  }
}
const server = new Apilogger().server;

server.listen(3000, () => console.log('listening'));
