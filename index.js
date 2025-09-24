// Import keep_alive first to prevent Railway from sleeping
const keep_alive = require('./keep_alive.js'); 
const Eris = require("eris");

// Ensure TOKEN is set
if (!process.env.TOKEN) {
  console.error("❌ No TOKEN found in environment variables!");
  process.exit(1);
}

// Connect the bot
const bot = new Eris(process.env.TOKEN);

// Log bot errors
bot.on("error", (err) => {
  console.error("Bot error:", err);
});

// Bot ready event
bot.on("ready", () => {
  console.log(`🤖 Logged in as ${bot.user.username}`);
});

// Message handler
bot.on("messageCreate", async (msg) => {
  if (msg.author.bot) return; // Ignore bots

  if (msg.content === "!ping") {
    const start = Date.now();
    const temp = await bot.createMessage(msg.channel.id, "🏓 Pinging...");

    const latency = Date.now() - start;
    const apiLatency = bot.shards.get(0).latency;
    const uptime = formatUptime(process.uptime());

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

// Helper: format uptime nicely
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  seconds %= 3600 * 24;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${days}d ${hours}h ${minutes}m ${secs}s`;
}

// Connect to Discord
bot.connect();
