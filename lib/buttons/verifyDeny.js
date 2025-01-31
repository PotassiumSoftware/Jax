const { MessageFlags } = require('discord.js')

module.exports = {
	data: {
		customId: 'button_verify_deny',
	},
	async execute(interaction) {
		return interaction.reply({
			content: 'fak you <:fak_you:1334747436748640358>',
			flags: MessageFlags.Ephemeral,
		})
	},
}
