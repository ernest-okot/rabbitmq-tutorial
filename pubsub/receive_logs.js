#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    var ex = 'logs';

    channel
      .assertExchange(ex, 'fanout', {durable: false})
      .then(() => channel.assertQueue('', {exclusive: true}))
      .then(q => {
        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

        channel.consume(q.queue, function(msg) {
          console.log(" [x] %s", msg.content.toString());
        }, {noAck: true});
      })
    
  })
  .catch(err => {
    throw err;
  });