const express = require('express'); // importing a CommonJS module
const helmet = require('helmet');
const morgan = require('morgan');

const hubsRouter = require('./hubs/hubs-router.js');
const dateLogger = require('./api/dateLogger');

const server = express();

function logger(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} to ${req.url}`)
  
  next();
}

function gateKeeper(req, res, next) {
  const password = req.headers.password || '';

  if (password) {
    if (password.toLowerCase() === 'melon') {
      next();
    } else {
      res.status(400).json({ you: 'cannot pass!' });
    }
  } else {
    res.status(400).json({ error: 'no password was provided' });
  }
}

function doubler(req, res, next) {
  const number = Number(req.query.number || 0);

  req.doubled = number * 2;

  next();
}

// Global Middleware * Runs on every request
server.use(helmet()); // third party
server.use(express.json());
server.use(gateKeeper);
server.use(dateLogger);
server.use(logger);
server.use(morgan('dev'));
server.use('/api/hubs', hubsRouter);

server.get('/', doubler, (req, res) => {
  res.status(200).json({ number: req.doubled });

  // const nameInsert = (req.name) ? ` ${req.name}` : '';

  // res.send(`
  //   <h2>Lambda Hubs API</h2>
  //   <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  //   `);
});

module.exports = server;
