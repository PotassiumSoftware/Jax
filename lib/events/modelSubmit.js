const { EmbedBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const fs = require('fs')
const path = require('path')
const config = require('../../config/main.json')

const verificationsFile = path.join(__dirname, '../../data/verifications.json')

if (!fs.existsSync(verificationsFile)) {
	fs.writeFileSync(verificationsFile, JSON.stringify([]))
}

const getVerifications = () => {
	const data = fs.readFileSync(verificationsFile, 'utf8')
	return JSON.parse(data)
}

const saveVerifications = verifications => {
	fs.writeFileSync(verificationsFile, JSON.stringify(verifications, null, 2))
}

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isModalSubmit()) return

		const modalCustomId = interaction.customId

		const modalHandlers = {
			model_verify: async () => {
				const userId = interaction.user.id
				let verifications = getVerifications()

				verifications.push(userId)
				saveVerifications(verifications)

				const rules = interaction.fields.getTextInputValue('rules')
				const name = interaction.fields.getTextInputValue('name')
				const age = interaction.fields.getTextInputValue('age')
				const joinLocation = interaction.fields.getTextInputValue('join_location')
				const userInfo = interaction.fields.getTextInputValue('user_info')

				const errorMessages = []

				if (!rules || !['yes', 'no', 'Yes', 'No'].includes(rules)) {
					errorMessages.push('Please answer the "Do you agree to the rules?" question with "Yes" or "No".')
				}
				if (!age || isNaN(age) || age <= 0 || age > 999) {
					errorMessages.push('Please enter a valid age (numeric form, between 1 and 999).')
				}

				if (errorMessages.length > 0) {
					const errorEmbed = new EmbedBuilder().setTitle('Error | Submission Invalid').setDescription(errorMessages.join('\n')).setColor(config.embeds.colors.error).setTimestamp()

					verifications = verifications.filter(id => id !== userId)
					saveVerifications(verifications)

					logger.error(`Verification failed for user ${userId}: ${errorMessages.join(', ')}`)

					return interaction.reply({
						embeds: [errorEmbed],
						flags: MessageFlags.Ephemeral,
					})
				}

				const logEmbed = new EmbedBuilder()
					.setAuthor({
						name: `${interaction.user.displayName} (${interaction.user.username})`,
						iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`,
					})
					.setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)
					.setTitle('Verification Submitted')
					.addFields(
						{ name: 'Rules Agreement', value: rules },
						{ name: 'Preferred Name', value: name || 'N/A' },
						{ name: 'Age', value: age },
						{ name: 'Invite Origin', value: joinLocation },
						{ name: 'User Information', value: userInfo || 'N/A' },
						{
							name: 'Creation Date',
							value: `<t:${Math.floor(interaction.user.createdTimestamp / 1000)}:f>`,
						},
					)
					.setColor(config.embeds.colors.default)
					.setTimestamp()
					.setFooter({ text: `User ID: ${interaction.user.id}` })

				const approve = new ButtonBuilder().setCustomId('button_verify_approve').setLabel('Approve').setStyle(ButtonStyle.Success)

				const deny = new ButtonBuilder().setCustomId('button_verify_deny').setLabel('Deny').setStyle(ButtonStyle.Danger)

				const avatar = new ButtonBuilder()
					.setLabel('Avatar')
					.setStyle(ButtonStyle.Link)
					.setURL(`https://lens.google.com/uploadbyurl?url=https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`)

				const tools = new ActionRowBuilder().addComponents(approve, deny, avatar)

				const responseEmbed = new EmbedBuilder()
					.setTitle('Verification Success')
					.setDescription('Your verification submission has been successfully sent.')
					.setColor(config.embeds.colors.success)
					.setTimestamp()

				await interaction.reply({
					embeds: [responseEmbed],
					flags: MessageFlags.Ephemeral,
				})

				const logChannel = interaction.guild.channels.cache.get(config.logging.verification)
				if (logChannel) {
					await logChannel.send({
						embeds: [logEmbed],
						components: [tools],
					})
				}

				logger.info(`Verification submitted for user ${userId}`)
			},
		}

		if (modalHandlers[modalCustomId]) {
			try {
				await modalHandlers[modalCustomId]()
			} catch (error) {
				logger.error(`Error handling modal ${modalCustomId}:`, error)

				const errorEmbed = new EmbedBuilder()
					.setTitle('Error | Submission Failed')
					.setDescription('There was an error while processing your submission.')
					.setColor(config.embeds.colors.error)
					.setTimestamp()

				await interaction.reply({
					embeds: [errorEmbed],
					flags: MessageFlags.Ephemeral,
				})

				let verifications = getVerifications().filter(id => id !== interaction.user.id)
				saveVerifications(verifications)

				logger.debug(`Removed verification for user ${interaction.user.id} after submission failure`)
			}
		} else {
			const unknownEmbed = new EmbedBuilder().setTitle('Error | Unknown Modal').setDescription('This modal submission is not recognized.').setColor(config.embeds.colors.error).setTimestamp()

			await interaction.reply({
				embeds: [unknownEmbed],
				flags: MessageFlags.Ephemeral,
			})

			logger.warn(`Unknown modal submission from user ${interaction.user.id}`)
		}
	},
}
