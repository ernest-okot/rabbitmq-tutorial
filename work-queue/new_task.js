#!/usr/bin/env node

var amqp = require('amqplib');
var msg = process.argv.slice(2).join(' ') || "Hello World!";

amqp.connect('amqp://localhost')
  .then(connection => {
    setTimeout(function() { connection.close(); process.exit(0) }, 500);
    return connection.createChannel();
  })
  .then(channel => {
    var q = 'tasks';

    channel.assertQueue(q, {durable: true});

    channel.sendToQueue(q, new Buffer(msg), {persistent: true});
    console.log(" [x] Sent '%s'", msg);
  })
  .catch(err => {
    throw err;
  });

