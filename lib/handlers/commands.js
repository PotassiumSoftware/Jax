const { Client, Collection, PermissionsBitField } = require("discord.js");
const { readdirSync } = require("fs");
const path = require("path");
const config = require("../../config.json");

module.exports = (client) => {
  if (!client.commands) {
    client.commands = new Collection();
  }

  const commandFolders = readdirSync(path.join(__dirname, "../commands"));

  commandFolders.forEach((folder) => {
    const commandFiles = readdirSync(path.join(__dirname, `../commands/${folder}`)).filter((file) =>
      file.endsWith(".ts") || file.endsWith(".js")
    );
    commandFiles.forEach((file) => {
      const command = require(path.join(__dirname, `../commands/${folder}/${file}`));
      client.commands.set(command.data.name, command); 
  });

  client.once("ready", async () => {
    const guild = client.guilds.cache.get(config.guildId);
    if (guild) {
      await guild.commands.set(client.commands.map((cmd) => cmd.data.toJSON()));
      console.log(`Commands registered to test guild: ${config.guildId}`);
    }
  });
};
