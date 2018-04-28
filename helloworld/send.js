#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    setTimeout(function() { connection.close(); process.exit(0) }, 500);
    return connection.createChannel();
  })
  .then(channel => {
    var q = 'hello';

    channel.assertQueue(q, {durable: false});

    channel.sendToQueue(q, new Buffer('Hello World!'));
    console.log(" [x] Sent 'Hello World!'");
  })
  .catch(err => {
    throw err;
  });

