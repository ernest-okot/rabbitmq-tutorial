#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    setTimeout(function() { connection.close(); process.exit(0) }, 500);
    return connection.createChannel();
  })
  .then(channel => {
    var ex = 'logs';
    var msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertExchange(ex, 'fanout', {durable: false});
    channel.publish(ex, '', new Buffer(msg));
    
    console.log(" [x] Sent %s", msg);
  })
  .catch(err => {
    throw err;
  });


