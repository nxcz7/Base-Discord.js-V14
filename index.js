const fs = require('fs');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const prefix = '!';

client.commands = new Map();

let loaded = 0;
let ignored = 0;

function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filepath = `${dir}/${file}`;
    const stat = fs.lstatSync(filepath);

    if (stat.isDirectory()) {
      loadCommands(filepath);
    } else if (file.endsWith('.js')) {
      try {
        const command = require(filepath);
        if (command.name && typeof command.execute === 'function') {
          client.commands.set(command.name, command);
          console.log(`✅ Comando carregado: ${command.name} (${filepath})`);
          loaded++;
        } else {
          console.log(`⚠️ Comando ignorado (falta name ou execute): ${filepath}`);
          ignored++;
        }
      } catch (error) {
        console.log(`❌ Erro ao carregar comando ${filepath}:`, error);
        ignored++;
      }
    }
  }
}

console.log('Carregando comandos recursivamente...');
loadCommands('./commands');

console.log(`\nResumo do carregamento:`);
console.log(`Comandos carregados: ${loaded}`);
console.log(`Comandos ignorados/erro: ${ignored}`);

client.once('ready', () => {
  console.log(`Bot online! ${client.user.tag}`);
});

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/\s+/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (error) {
    console.error(`Erro ao executar comando ${commandName}:`, error);
    message.reply('Ocorreu um erro ao executar este comando.');
  }
});

client.login(process.env.TOKEN);