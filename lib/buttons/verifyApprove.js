const { MessageFlags, EmbedBuilder, PermissionsBitField } = require('discord.js')
const config = require('../../config/main.json')

module.exports = {
	data: {
		customId: 'button_verify_approve',
	},
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			const footer = interaction.message.embeds[0]?.footer?.text
			const userId = footer?.match(/User ID: (\d+)/)?.[1]

			return interaction.reply({
				content: 'fak you <:fak_you:1334747436748640358>',
				flags: MessageFlags.Ephemeral,
			})
		} else {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Error | Permission Denied')
				.setDescription('You do not have the required permissions to execute this command.')
				.addFields({
					name: 'Missing Permissions',
					value: `\`MANAGE_ROLES\``,
				})
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({
				embeds: [errorEmbed],
				flags: MessageFlags.Ephemeral,
			})
		}
	},
}
