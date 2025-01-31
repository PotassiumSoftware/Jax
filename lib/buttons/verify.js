const { ButtonInteraction, MessageFlags } = require('discord.js');

module.exports = {
	data: {
		customId: 'button_verify',
	},
	async execute(interaction) {
		await interaction.reply({
			content: 'fak you <:fak_you:1334747436748640358>',
			flags: MessageFlags.Ephemeral,
		});
	},
};
