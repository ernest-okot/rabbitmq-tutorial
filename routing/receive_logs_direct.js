#!/usr/bin/env node

var amqp = require('amqplib');

var args = process.argv.slice(2);

amqp.connect('amqp://localhost')
  .then(connection => {
    return connection.createChannel();
  })
  .then(channel => {
    var ex = 'direct_logs';

    channel
      .assertExchange(ex, 'direct', {durable: false})
      .then(() => channel.assertQueue('', {exclusive: true}))
      .then(q => {
        console.log("[*] Waiting for logs. To exit press CTRL+C", args.join(', '));

        args.forEach(severity => {
          console.log("[*] Receiving on routing key %s", severity);
          channel.bindQueue(q.queue, ex, severity);
        })

        channel.consume(q.queue, function(msg) {
          console.log("[x] %s: %s", msg.fields.routingKey, msg.content.toString());
        }, {noAck: true});
      })
    
  })
  .catch(err => {
    throw err;
  });