const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args, color) => {
  


    message.reply(`**:racket: Pong! __${client.ws.ping}__ms**`)

}
exports.conf = {
    aliases: ['pong', 'botping'],
    cooldown: "5"
}

exports.help = {
    name: 'ping',
    description: 'Ver meu ping',
    usage: 'ping'
}