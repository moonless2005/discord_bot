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
// index.js

const { 
    Client, 
    GatewayIntentBits,
    Routes,           // <--- Cần cho việc đăng ký lệnh (bước sau)
    REST,             // <--- Cần cho việc đăng ký lệnh (bước sau)
} = require('discord.js');

// 💡 Thêm Intent GuildMessages để xử lý Lệnh Gạch chéo
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages, // <--- THÊM DÒNG NÀY
        GatewayIntentBits.MessageContent,  // <--- THÊM DÒNG NÀY (Nếu cần xử lý tin nhắn)
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


// ===========================================
// 💡 THÊM PHẦN XỬ LÝ LỆNH GẠCH CHÉO (/PING)
// ===========================================
client.on('interactionCreate', async interaction => {
	// 1. Chỉ xử lý khi tương tác là Lệnh Gạch chéo
	if (!interaction.isChatInputCommand()) return;

	// 2. Xử lý lệnh /ping
	if (interaction.commandName === 'ping') {
		// interaction.reply là cách bot phản hồi lại lệnh gạch chéo
		await interaction.reply({ content: 'Pong!', ephemeral: true }); 
        // ephemeral: true chỉ hiển thị câu trả lời với người dùng thực hiện lệnh
	}
});


client.login(process.env.TOKEN);

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
	res.send('Discord Bot is running and waiting for events!');
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
