const { SlashCommandBuilder } = require("discord.js");

const data = new SlashCommandBuilder()
  .setName("broken")
  .setDescription("This command is intentionally broken.");

async function execute(interaction) {
  throw new Error("This is a forced error for testing purposes.");
}

module.exports = { data, execute };
