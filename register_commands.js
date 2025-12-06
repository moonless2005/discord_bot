// register_commands.js

const { REST, Routes } = require('discord.js');

// Cấu hình lệnh /ping
const commands = [
    {
        name: 'ping',
        description: 'Kiểm tra độ trễ của Bot.',
    },
];

const TOKEN = process.env.TOKEN; 
const CLIENT_ID = process.env.CLIENT_ID; // Thêm biến CLIENT_ID vào Render

if (!TOKEN || !CLIENT_ID) {
    console.error("Lỗi: Thiếu TOKEN hoặc CLIENT_ID. Vui lòng thêm vào biến môi trường.");
    process.exit(1);
}

// Khởi tạo Discord REST API
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Đang bắt đầu đăng ký ${commands.length} lệnh ứng dụng (/)`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, '1398654698671837304'),
            { body: commands },
        );

        console.log(`Đã tải lại thành công ${data.length} lệnh.`);
    } catch (error) {
        console.error(error);
    }
})();
