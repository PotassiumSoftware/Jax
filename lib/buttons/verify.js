const { MessageFlags } = require('discord.js');

module.exports = {
	data: {
		customId: 'button_verify',
	},
	async execute(interaction) {
		const modal = interaction.client.modals.get('model_verify');

		if (!modal) {
			return interaction.reply({
				content: 'Verification modal not found.',
				ephemeral: true,
			});
		}

		await modal.execute(interaction);
	},
};
