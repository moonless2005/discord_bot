const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

client.on('guildMemberAdd', member => {
    const channel = member.guild.systemChannel;
    if (channel) channel.send(`Hoan nghênh ${member.user.tag} gia nhập Nghịch Nguyệt Thần Cung!`);
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.systemChannel;
    if (channel) channel.send(` ${member.user.tag} đã rời đi vì sự ô uế của bản thân!`);
});

client.login(process.env.TOKEN);
const express = require('express');
const app = express();

// Cổng HTTP mà Render gán cho dịch vụ (thường là 10000)
const PORT = process.env.PORT || 3000; 

// Tạo một endpoint cơ bản để Render kiểm tra (Health Check)
app.get('/', (req, res) => {
  res.send('Discord Bot is running and waiting for events!');
});

// Khởi động server HTTP
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
