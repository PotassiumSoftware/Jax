const { MessageFlags, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../config/main.json')
const userVerify = require('../events/userVerify.js')

module.exports = {
	data: {
		customId: 'button_verify_deny',
	},
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			const footer = interaction.message.embeds[0]?.footer?.text
			const userId = footer?.match(/User ID: (\d+)/)?.[1]
			const reviewer = interaction.user.id

			userVerify.execute(userId, 'deny', reviewer, interaction)

			const approve = new ButtonBuilder().setCustomId('button_verify_approve').setLabel('Approve').setStyle(ButtonStyle.Success).setDisabled(true)

			const deny = new ButtonBuilder().setCustomId('button_verify_deny').setLabel('Deny').setStyle(ButtonStyle.Danger).setDisabled(true)

			const avatar = new ButtonBuilder()
				.setLabel('Avatar')
				.setStyle(ButtonStyle.Link)
				.setURL(`https://lens.google.com/uploadbyurl?url=https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)

			const tools = new ActionRowBuilder().addComponents(approve, deny, avatar)

			await interaction.update({
				components: [tools],
			})

			return interaction.followUp({
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
