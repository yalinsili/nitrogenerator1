const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const moment = require('moment');
const settings = require('./settings.json');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const init = async () => {
  await fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err)
    console.log(`${moment().format("hh:mma DD/MM/YYYY")} | ${files.length} komut yükleniyor...`)
    files.forEach((f, i) => {
      let pull = require(`./commands/${f}`);
      console.log(`${moment().format("hh:mma DD/MM/YYYY")} | ${pull.config.name.toUpperCase()} adlı komut yüklendi!`)
      client.commands.set(pull.config.name, pull);  
      pull.config.aliases.forEach(alias => {
        client.aliases.set(alias, pull.config.name)
      });
    });
  });

  await fs.readdir('./events/', (err, files) => {
    if (err) console.error(err);
	console.log(`${moment().format("hh:mma DD/MM/YYYY")} |`)
    console.log(`${moment().format("hh:mma DD/MM/YYYY")} | ${files.length} olay yükleniyor...`);
    files.forEach(f => {
      const eventName = f.split(".")[0];
      const event = require(`./events/${f}`);
      client.on(eventName, event.bind(null, client));
      console.log(`${moment().format("hh:mma DD/MM/YYYY")} | ${eventName.toUpperCase()} adlı olay yüklendi!`);
    });
  });

client.login(settings.token);
};

init();

client.permission = (message, text) => {
  if (text.toUpperCase().includes('NONE')) return true;
  if (text.toUpperCase().includes('BOT_OWNER') && !settings.owner.includes(message.author.id)) return false;
  if (text.toUpperCase().includes('SERVER_OWNER') && message.author.id !== message.guild.owner.user.id) return false;
  if (!message.member.hasPermission(text.toUpperCase())) return false;
  return true;
};