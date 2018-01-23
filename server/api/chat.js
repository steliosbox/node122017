const express = require('express');
const router = express.Router();
const app = express();
const server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', ws => {
  console.log('connection');
});


router.get('/', (req, res, next) => {
  const app = express();
  const server = require('http').createServer(app);

  var io = require('socket.io')(server);

  io.on('connection', ws => {
    console.log('connection');
  });
});

router.post('/', (req, res, next) => {
  console.log('chat');
});

module.exports = router;
