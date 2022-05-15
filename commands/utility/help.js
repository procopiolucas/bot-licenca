const { MessageActionRow, MessageSelectMenu, MessageEmbed} = require('discord.js')
const Discord = require('discord.js')
const { readdirSync } = require("fs");
exports.run = async (client, message, args, color) => {


  if (!args[0]) {
    let categories = [];

    readdirSync('./commands').forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.map((command) => {
        let file = require(`../../commands/${dir}/${command}`);

        if (!file.help.name) return "Comando sem nome!";

        let name = file.help.usage.replace(".js", "");
        let description = file.help.description;

        return `\`${client.prefix}${name}\` \n`;
      });

      let data = new Object();
console.log(dir)
      data = {
        name: dir.toUpperCase(),
        value: cmds.length === 0 ? "Em andamento." : cmds.join(" "),
      };

      categories.push(data);
    });

    const embed = new MessageEmbed()
      .setTitle(" Meus Comandos")
      .addFields(categories)
      .setDescription(
        `[] = OPICIONAL
         {} = OBRIGATORIO
         
        
         Para obter uma maior info use ${client.prefix}help [comando]
        `
      )

      .setTimestamp()
      .setColor("BLUE");
    return message.reply({ embeds: [embed] });
  
      }  else {
        const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.find(
        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
      );

    if (!command) {
      const embed = new MessageEmbed()
        .setTitle(
          `Comando invalido! Use \`${client.prefix}help\` para ver todos meus comandos!`
        )
        .setColor("BLUE");
      return message.reply({ embeds: [embed] });
    }
    const embed = new MessageEmbed()
    .setTitle("Comando info:")
    .addField("Prefixo:", `\`${client.prefix}\``)
    .addField(
      "Comando:", `${
      command.help.name ? `\`${command.help.name}\`` : "Comando sem nome" }`
    )
    .addField(
      "> Aliases:",
      `${command.conf.aliases
        ? `\`${command.conf.aliases.join("` `")}\``
        : "Comandos sem aliases" }`
    )
    .addField(
      "> Como usar:", `${client.prefix}${command.help.usage}`

    )
    .addField(
      "> Descrição:", `${
      command.help.description
        ? command.help.description
        : "Comando sem desc" }`
    )

    .setTimestamp()
    .setColor("BLUE");
  return message.reply({ embeds: [embed] });
  }
}
  
            
            exports.conf = {
              aliases: ['h', 'cmds', 'cmdlist'],
              cooldown: "5"
          }
          
          
exports.help = {
  name: 'help',
  description: 'Todos meus comandos',
  usage: 'help'
}