const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { performance } = require("perf_hooks"); 
const { pool } = require("../../handlers/db.js"); 
const config = require('../../../config.json');

const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with bot latency.");

async function execute(interaction) {
  const startTime = performance.now();
  await interaction.deferReply(); 

  const botPing = Math.round(performance.now() - startTime) || "nil";
  const apiPing = interaction.client.ws.ping || "nil";

  let dbPing = "nil";
  const dbStart = performance.now();
  try {
    const client = await pool.connect();
    dbPing = Math.round(performance.now() - dbStart) || "nil"; 
    client.release(); 
  } catch (err) {
    console.error("Error with database ping:", err);
  }

  const embed = new EmbedBuilder()
    .setTitle("Pong!")
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
