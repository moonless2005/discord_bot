const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.systemChannel;
    if (channel) channel.send(`👋 ${member.user.tag} vừa vào server!`);
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.systemChannel;
    if (channel) channel.send(`👋 ${member.user.tag} đã rời server!`);
});

client.login(process.env.TOKEN);
