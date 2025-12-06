// register_commands.js

const { REST, Routes } = require('discord.js');

// Cấu hình lệnh /ping
const commands = [
    {
        name: 'ping',
        description: 'Kiểm tra độ trễ của Bot.',
    },
];

// Lấy Token và Client ID từ biến môi trường
const TOKEN = process.env.TOKEN; 
const CLIENT_ID = process.env.CLIENT_ID; 
// ID Server Discord của bạn (cần điền giá trị thật)
const GUILD_ID = '1398654698671837304'; // <--- Đảm bảo ID này là ID server Discord THẬT của bạn

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
    console.error("Lỗi: Thiếu TOKEN, CLIENT_ID, hoặc GUILD_ID. Vui lòng kiểm tra biến môi trường và code.");
    process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Đang bắt đầu đăng ký ${commands.length} lệnh ứng dụng (/) cho Server ${GUILD_ID}`);

        // Đăng ký lệnh cho Server Development
        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands },
        );

        console.log(`Đã tải lại thành công ${data.length} lệnh.`);
    } catch (error) {
        console.error("Lỗi khi đăng ký lệnh:", error);
    }
})();
