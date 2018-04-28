#!/usr/bin/env node

var amqp = require('amqplib');

amqp.connect('amqp://localhost')
  .then(connection => {
    setTimeout(function() { connection.close(); process.exit(0) }, 500);
    return connection.createChannel();
  })
  .then(channel => {
    var ex = 'direct_logs';
    var args = process.argv.slice(2);
    var severity = (args.length > 0) ? args[0] : 'info';
    var msg = args.slice(1).join(' ') || 'Hello World!';

    channel.assertExchange(ex, 'direct', {durable: false});
    channel.publish(ex, severity, new Buffer(msg));
    
    console.log(" [x] Sent %s %s", severity, msg);
  })
  .catch(err => {
    throw err;
  });