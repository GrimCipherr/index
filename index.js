const Eris = require("eris");
const express = require("express");

// Make sure TOKEN exists
if (!process.env.TOKEN) {
  console.error("❌ No TOKEN found in environment variables!");
  process.exit(1);
}

// Web server for Railway "keep alive"
const app = express();
app.get("/", (req, res) => res.send("✅ Bot is running on Railway!"));
app.listen(3000, () => console.log("🌐 Web server started on port 3000"));

// Connect bot
const bot = new Eris(process.env.TOKEN);

bot.on("error", (err) => {
  console.error("Bot error:", err);
});

bot.on("ready", () => {
  console.log(`🤖 Logged in as ${bot.user.username}`);
});

// Commands
bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;

  if (msg.content === "!ping") {
    const start = Date.now();
    const temp = await bot.createMessage(msg.channel.id, "🏓 Pinging...");

    const latency = Date.now() - start;
    const uptime = formatUptime(process.uptime());
    const apiLatency = bot.shards.get(0).latency;

    const embed = {
      title: "📊 Bot Status",
      color: 0x00ff00,
      fields: [
        { name: "Message Latency", value: `${latency}ms`, inline: true },
        { name: "API Latency", value: `${apiLatency}ms`, inline: true },
        { name: "Uptime", value: uptime, inline: true },
        { name: "Status", value: "✅ Good", inline: true }
      ],
      footer: { text: "Railway Bot" },
      timestamp: new Date()
    };

    await bot.editMessage(msg.channel.id, temp.id, { content: "", embed });
  }
});

// Helper: uptime formatting
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

bot.connect();
