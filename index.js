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
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const games = new Map(); // lưu game theo channel

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Bắt đầu game
    if (message.content.startsWith('!xo')) {
        const opponent = message.mentions.users.first();
        if (!opponent) return message.reply("Nhập người chơi để bắt đầu!");
        if (opponent.id === message.author.id) return message.reply("Bạn không thể chơi với chính mình!");

        // Tạo board trống
        const board = Array(9).fill(null);
        const game = { board, turn: "X", players: [message.author.id, opponent.id] };
        games.set(message.channel.id, game);

        // Tạo nút
        const rows = createBoardButtons(board);

        const msg = await message.channel.send({
            content: `🎮 Game bắt đầu! ${message.author} (X) vs ${opponent} (O)\nLượt X đánh trước`,
            components: rows
        });

        // Collector để nghe nút
        const collector = msg.createMessageComponentCollector({ componentType: ComponentType.Button, time: 600000 });

        collector.on('collect', i => {
            const userId = i.user.id;
            if (!game.players.includes(userId)) return i.reply({ content: "Bạn không phải người chơi!", ephemeral: true });
            if ((game.turn === "X" && userId !== game.players[0]) || (game.turn === "O" && userId !== game.players[1])) {
                return i.reply({ content: "Chưa tới lượt bạn!", ephemeral: true });
            }

            const idx = parseInt(i.customId);
            if (game.board[idx]) return i.reply({ content: "Ô này đã đánh rồi!", ephemeral: true });

            // Đánh lượt
            game.board[idx] = game.turn;

            const winner = checkWinButtons(game.board);
            game.turn = game.turn === "X" ? "O" : "X";

            // Cập nhật nút
            const newRows = createBoardButtons(game.board, winner);

            i.update({ content: winner ? (winner==="Tie" ? "Hoà!" : winner+" thắng!") : `Lượt ${game.turn}`, components: newRows });

            if (winner) collector.stop();
        });
    }
});

// ===== Hàm tạo nút =====
function createBoardButtons(board, winner) {
    const rows = [];
    for (let r = 0; r < 3; r++) {
        const row = new ActionRowBuilder();
        for (let c = 0; c < 3; c++) {
            const idx = r*3+c;
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(idx.toString())
                    .setLabel(board[idx] || " ")
                    .setStyle(board[idx] === "X" ? ButtonStyle.Primary : board[idx] === "O" ? ButtonStyle.Danger : ButtonStyle.Secondary)
                    .setDisabled(!!board[idx] || !!winner)
            );
        }
        rows.push(row);
    }
    return rows;
}

// ===== Kiểm tra thắng =====
function checkWinButtons(board) {
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8], // hàng
        [0,3,6],[1,4,7],[2,5,8], // cột
        [0,4,8],[2,4,6]          // chéo
    ];
    for (let combo of winCombos) {
        const [a,b,c] = combo;
        if (board[a] && board[a] === board[b] && board[b] === board[c]) return board[a];
    }
    if (board.every(cell => cell)) return "Tie";
    return null;
}

