// index.js - Code hoàn chỉnh cho Bot và Render Health Check

const { 
    Client, 
    GatewayIntentBits,
    // Không cần Routes, REST ở đây, chúng chỉ dùng trong register_commands.js
} = require('discord.js');

// === 1. KHỞI TẠO CLIENT VÀ INTENTS (CHỈ MỘT LẦN) ===
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        // Cần cho xử lý Slash Commands
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
    ]
});

// === 2. XỬ LÝ EVENTS (JOIN/LEAVE) ===
client.on('guildMemberAdd', member => {
    const channel = member.guild.systemChannel;
    // Đã sửa lại tin nhắn chào mừng theo ý bạn
    if (channel) channel.send(`Hoan nghênh ${member.user.tag} gia nhập Nghịch Nguyệt Thần Cung!`);
});

client.on('guildMemberRemove', member => {
    const channel = member.guild.systemChannel;
    // Đã sửa lại tin nhắn tạm biệt theo ý bạn
    if (channel) channel.send(` ${member.user.tag} đã rời đi vì sự ô uế của bản thân!`);
});


// === 3. XỬ LÝ LỆNH GẠCH CHÉO (/PING) ===
client.on('interactionCreate', async interaction => {
	// Chỉ xử lý khi tương tác là Lệnh Gạch chéo
	if (!interaction.isChatInputCommand()) return;

	// Xử lý lệnh /ping
	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true }); 
	}
});


// === 4. ĐĂNG NHẬP BOT ===
client.login(process.env.TOKEN);


// === 5. RENDER HEALTH CHECK (EXPRESS) ===
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000; 

app.get('/', (req, res) => {
	res.send('Discord Bot is running and waiting for events!');
});

app.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
