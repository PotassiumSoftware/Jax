const { Client, Collection, PermissionsBitField } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');
const config = require('../../config/main.json');

module.exports = (client) => {
	if (!client.commands) {
		client.commands = new Collection();
	}

	const commandFolders = readdirSync(path.join(__dirname, '../commands'));

	commandFolders.forEach((folder) => {
		const commandFiles = readdirSync(
			path.join(__dirname, `../commands/${folder}`)
		).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

		commandFiles.forEach((file) => {
			const command = require(
				path.join(__dirname, `../commands/${folder}/${file}`)
			);
			if (command.data && command.data.name) {
				client.commands.set(command.data.name, command);
			} else {
				console.warn(
					`Command file ${file} is missing a valid 'data.name' property.`
				);
			}
		});
	});

	client.once('ready', async () => {
		const guild = client.guilds.cache.get(config.guildId);
		if (guild) {
			try {
				await guild.commands.set(
					client.commands.map((cmd) => cmd.data.toJSON())
				);
				console.log(`Commands registered to test guild: ${config.guildId}`);
			} catch (error) {
				console.error('Error registering commands:', error);
			}
		} else {
			console.warn(`Guild with ID ${config.guildId} not found.`);
		}
	});
};
