#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    var q = 'hello';

    channel.assertQueue(q, {durable: false});

    channel.consume(q, (msg) => {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
    
  })
  .catch(err => {
    throw err;
  });