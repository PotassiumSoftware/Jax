const { MessageFlags, EmbedBuilder } = require('discord.js')
const path = require('path')
const fs = require('fs')
const config = require('../../config/main.json')

const verificationsFile = path.join(__dirname, '../../data/verifications.json')

const getVerifications = () => {
	const data = fs.readFileSync(verificationsFile, 'utf8')
	return JSON.parse(data)
}

module.exports = {
	data: {
		customId: 'button_verify',
	},
	async execute(interaction) {
		const { client, user } = interaction
		const userId = user.id

		logger.debug(`Verification initiated by ${user.tag} (ID: ${userId})`)

		let verifications = getVerifications()

		if (verifications.includes(userId)) {
			logger.debug(`User ${userId} has already submitted a verification request`)

			const alreadySubmittedEmbed = new EmbedBuilder()
				.setTitle('Error | Duplicate Submission')
				.setDescription('You already have a pending verification request. Please wait for it to be processed.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [alreadySubmittedEmbed], flags: MessageFlags.Ephemeral })
		}

		const modal = client.modals.get('modal_verify')
		if (!modal) {
			logger.debug('Verification modal not found')

			const modalErrorEmbed = new EmbedBuilder()
				.setTitle('Error | Verification Modal Not Found')
				.setDescription('The verification submission form could not be found.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [modalErrorEmbed], flags: MessageFlags.Ephemeral })
		}

		await modal.execute(interaction)
		logger.debug(`Verification modal executed successfully for user ${userId}`)
	},
}
