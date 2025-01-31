const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const path = require('path');

module.exports = (client) => {
	if (!client.buttons) {
		client.buttons = new Collection();
	}

	const buttonFiles = readdirSync(path.join(__dirname, '../buttons')).filter(
		(file) => file.endsWith('.ts') || file.endsWith('.js')
	);

	buttonFiles.forEach((file) => {
		const button = require(path.join(__dirname, `../buttons/${file}`));
		if (button.data && button.data.customId) {
			client.buttons.set(button.data.customId, button);
		} else {
			console.warn(
				`Button file ${file} is missing a valid 'data.customId' property.`
			);
		}
	});

	client.on('interactionCreate', async (interaction) => {
		if (!interaction.isButton()) return;

		const button = client.buttons.get(interaction.customId);
		if (!button) return;

		try {
			await button.execute(interaction);
		} catch (error) {
			console.error(
				`Error executing button interaction: ${interaction.customId}`,
				error
			);
		}
	});
};
