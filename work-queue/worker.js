#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    var q = 'tasks';

    channel.assertQueue(q, {durable: true});
    channel.prefetch(2);

    channel.consume(q, (msg) => {
      var secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString());

      setTimeout(function() {
        console.log(" [x] Finished %s", msg.content.toString());
        channel.ack(msg);
      }, secs * 1000);

    }, {noAck: false});
    
  })
  .catch(err => {
    throw err;
  });