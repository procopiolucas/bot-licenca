const Discord = require("discord.js")
const client = new Discord.Client({intents: 32767, disableMentions: "all"})
const config = require("./config.json")
const pv = require("./Private.json")

client.prefix = config.prefix
client.token = pv.token

client.on('ready', () => {
  console.log("on")
})

client.login(client.token)

client.logsativas = config.logsativas
client.logsresgatadas = config.logsresgatadas
const fs = require("fs"); 
client.commands = new Discord.Collection(); 
client.aliases = new Discord.Collection();
client.helps = new Discord.Collection(); 
const { Collection } = require("discord.js");
const cooldowns = new Collection;

fs.readdir('./commands/', (err, categories) => {
        if (err) console.log(err);
        categories.forEach(category => {
            let moduleConf = require(`./commands/utility/module.json`);
            moduleConf.path = `./commands/${category}`;
            moduleConf.cmds = [];
            moduleConf.usage = [];
            moduleConf.names = [];
            client.helps.set(category, moduleConf);
            if (!moduleConf) return;
            fs.readdir(`./commands/${category}`, (err, files) => {
                if (err) console.log(err);
                let commands = new Array();
                files.forEach(file => {
                    if (!file.endsWith('.js')) return;
                    let prop = require(`./commands/${category}/${file}`);
                    let cmdName = file.split('.')[0];
                    client.commands.set(prop.help.name, prop);
                    prop.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, prop.help.name);
                    });
                    client.helps.get(category).cmds.push(prop.help)
                    client.helps.get(category).usage.push(prop.help.how)
                  client.helps.get(category).names.push(prop.help.another)
                });
            });
        });
    });


client.on('message', async message => {
    const prefix = client.prefix;

    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;
    if (!message.member) message.member = await message.guild.fetchMember(message);

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    
    if (cmd.length === 0) return;
  
  const color = "BLUE"
  
      let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if (!commandFile) return;
    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Collection());
    }
    const member = message.member;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 5) * 1000;

    if (!timestamps.has(member.id)) {
        timestamps.set(member.id, now);
    } else {
        const expirationTime = timestamps.get(member.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send({
              embeds:  [{
                color: color,
                description: `Error: (Ratelimit) <@${message.author.id}>, espere \`${timeLeft.toFixed(1)}s\` para usar comando novamente!`
              }]
            })
        }

        timestamps.set(member.id, now);
        setTimeout(() => timestamps.delete(member.id), cooldownAmount);
    }
  
    try {
  let commands = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  commands.run(client, message, args, color, prefix);
  if (!commands) return;
  } catch (e) {
  } finally {
  } 
});
