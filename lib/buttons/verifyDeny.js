const { MessageFlags, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const path = require('path')
const fs = require('fs')
const config = require('../../config/main.json')

const verificationsFile = path.join(__dirname, '../../data/verifications.json')

const getVerifications = () => {
	const data = fs.readFileSync(verificationsFile, 'utf8')
	return JSON.parse(data)
}

const saveVerifications = verifications => {
	fs.writeFileSync(verificationsFile, JSON.stringify(verifications, null, 2))
}

module.exports = {
	data: {
		customId: 'button_verify_deny',
	},
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			const footer = interaction.message.embeds[0]?.footer?.text
			const userId = footer?.match(/User ID: (\d+)/)?.[1]

			let verifications = getVerifications()
			verifications = verifications.filter(id => id !== userId)
			saveVerifications(verifications)

			const approve = new ButtonBuilder().setCustomId('button_verify_approve').setLabel('Approved').setStyle(ButtonStyle.Success).setDisabled(true)

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
