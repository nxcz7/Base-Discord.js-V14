const util = require('util');

module.exports = {
  name: 'eval',
  description: 'Executa código JavaScript (somente para o dono)',
  async execute(message, args) {
    if (message.author.id !== '745614232925503508') 
      return message.reply('Você não tem permissão para usar este comando.');

    const code = args.join(' ');
    if (!code) return message.reply('Por favor, forneça o código para executar.');

    try {
      let evaled = eval(code);

      if (typeof evaled !== 'string') {
        evaled = util.inspect(evaled, { depth: 0 });
      }

      if (evaled.length > 1950) {
        evaled = evaled.slice(0, 1950) + '... (output truncado)';
      }

      message.channel.send(`\`\`\`js\n${evaled}\n\`\`\``);
    } catch (err) {
      message.channel.send(`Erro ao executar o código:\n\`\`\`js\n${err.message || err}\n\`\`\``);
    }
  }
};