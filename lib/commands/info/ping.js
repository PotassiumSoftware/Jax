const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { performance } = require("perf_hooks"); 
const config = require('../../../config.json');

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with bot, API, and database latency.");

async function execute(interaction) {
  const startTime = performance.now();
  await interaction.deferReply(); 

  const botPing = Math.round(performance.now() - startTime);
  const apiPing = interaction.client.ws.ping;
  const dbPing = "NIL"; 

  const embed = new EmbedBuilder()
    .setTitle("🏓 Pong!")
    .setColor(config.embeds.colors.default)
    .addFields(
      { name: "Bot Latency", value: `\`${botPing}\`ms` },
      { name: "API Latency", value: `\`${apiPing}\`ms` },
      { name: "Database Latency", value: `\`${dbPing}\`ms` }
    )
    .setTimestamp();

  await interaction.editReply({ embeds: [embed] });
}

module.exports = { data, execute };
