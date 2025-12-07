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
// === 6. XỬ LÝ LỆNH XO 3x3 ===
const games = new Map(); // lưu game theo channel

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    // Lệnh bắt đầu game
    if (message.content.startsWith('!xo')) {
        const opponent = message.mentions.users.first();
        if (!opponent) return message.reply("Nhập người chơi để bắt đầu!");
        if (opponent.id === message.author.id) return message.reply("Bạn không thể chơi với chính mình!");

        const board = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""]
        ];
        const game = { board, turn: "X", players: [message.author.id, opponent.id] };
        games.set(message.channel.id, game);

        message.channel.send(`🎮 Game bắt đầu! ${message.author} (X) vs ${opponent} (O)\n\n${renderBoard(board)}\n\nX đánh trước, dùng !move hàng cột`);
    }

    // Lệnh đánh lượt
    if (message.content.startsWith('!move')) {
        const game = games.get(message.channel.id);
        if (!game) return;
        if (!game.players.includes(message.author.id)) return;

        const args = message.content.split(' ');
        const row = parseInt(args[1])-1;
        const col = parseInt(args[2])-1;

        if (isNaN(row) || isNaN(col) || row < 0 || row > 2 || col < 0 || col > 2) 
            return message.reply("Cú pháp sai! Dùng !move hàng cột (1-3)");
        if (game.board[row][col]) return message.reply("Ô này đã được đánh!");

        game.board[row][col] = game.turn;

        const winner = checkWin(game.board);
        if (winner) {
            games.delete(message.channel.id);
            return message.channel.send(`${renderBoard(game.board)}\n\n${winner === "Tie" ? "Hoà!" : winner + " thắng!"}`);
        }

        // đổi lượt
        game.turn = game.turn === "X" ? "O" : "X";
        message.channel.send(`${renderBoard(game.board)}\n\nLượt ${game.turn}`);
    }
});

// ===== Hàm hiển thị bảng =====
function renderBoard(board) {
    return board.map(row => row.map(cell => cell || "⬜").join("")).join("\n");
}

// ===== Hàm kiểm tra thắng =====
function checkWin(board) {
    // hàng
    for (let row of board) if (row[0] && row[0] === row[1] && row[1] === row[2]) return row[0];
    // cột
    for (let i=0;i<3;i++) if (board[0][i] && board[0][i]===board[1][i] && board[1][i]===board[2][i]) return board[0][i];
    // chéo
    if (board[0][0] && board[0][0]===board[1][1] && board[1][1]===board[2][2]) return board[0][0];
    if (board[0][2] && board[0][2]===board[1][1] && board[1][1]===board[2][0]) return board[0][2];
    // hoà
    if (board.flat().every(cell => cell)) return "Tie";
    return null;
}
