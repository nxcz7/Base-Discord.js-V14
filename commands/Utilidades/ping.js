// commands/ping.js
module.exports = {
  name: 'ping',
  description: 'Responde com pong',
  execute(message, args) {
    message.channel.send('> ● Ping Pong!');
  }
};