'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({port: process.env.PORT || 3000});

server.register(require('inert'), (err) => {
  if (err) {
    throw err;
  }

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.file('./public/index.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/board',
    handler: function (request, reply) {
      reply.file('./public/board.html');
    }
  });

  server.route({
    method: 'GET',
    path: '/bower_components/{param*}',
    handler: {
      directory: {
        path: 'bower_components'
      }
    }
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log('Server running at:', server.info.uri);
});

var io = require('socket.io')(server.listener);
io.on('connection', function (socket) {
  socket.on('board', function (msg) {
    socket.broadcast.emit('board', msg);
  });
});
