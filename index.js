const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once('ready', () => {
    console.log(`✅ Bot berhasil masuk sebagai ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!maha")) {
        const userMessage = message.content.replace(/^!maha\s*/, "").trim();

        //Default pesan jika pengguna mengetikan !maha tanpa tambahan kata
        if (!userMessage) {
            return message.reply("Hallo aku adalah discord AI Maha Silahkan tanya tentang apapun😊");
        }

        try {
            await message.channel.sendTyping(); 

            const response = await axios.post(GEMINI_URL, {
                contents: [{ parts: [{ text: userMessage }] }]
            }, { timeout: 10000 });

            let replyText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak bisa menjawab saat ini.";

            //Membatasi hanya 200 karakter
            if (replyText.length > 2000) {
                replyText = replyText.substring(0, 1997) + "...";
            }

            await message.reply(replyText);
        } catch (error) {
            console.error("❌ Error saat menghubungi API Gemini:", error.response ? error.response.data : error.message);
            await message.reply("⚠️ Maaf, terjadi kesalahan saat menghubungi AI. Silakan coba lagi nanti!");
        }
    }
});

client.login(TOKEN);


