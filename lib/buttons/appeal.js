const { MessageFlags, EmbedBuilder } = require('discord.js')
const path = require('path')
const fs = require('fs')
const config = require('../../config/main.json')

const appealsFile = path.join(__dirname, '../../data/appeals.json')

const getAppeals = () => {
	const data = fs.readFileSync(appealsFile, 'utf8')
	return JSON.parse(data)
}

module.exports = {
	data: {
		customId: 'button_appeal',
	},
	async execute(interaction) {
		const { client, user } = interaction
		const userId = user.id

		logger.debug(`Appeal initiated by ${user.tag} (ID: ${userId})`)

		const primaryGuild = client.guilds.cache.get(config.guildId)
		if (!primaryGuild) {
			logger.error('Primary server not found')

			const errorEmbed = new EmbedBuilder()
				.setTitle('Error | Server Not Found')
				.setDescription('Could not find the primary server. Please contact support.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
		}

		let isBanned = false
		let isTimedOut = false

		try {
			await primaryGuild.bans.fetch(userId)
			isBanned = true
			logger.debug(`User ${userId} is banned and eligible for appeal`)
		} catch (error) {
			if (error.code !== 10026) {
				logger.error(`Error fetching ban status for ${userId}: ${error.message}`)
				const errorEmbed = new EmbedBuilder()
					.setTitle('Error | Appeal Check Failed')
					.setDescription('An error occurred while checking your appeal eligibility.')
					.setColor(config.embeds.colors.error)
					.setTimestamp()

				return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
			}
		}

		const member = await primaryGuild.members.fetch(userId).catch(() => null)
		if (member && member.communicationDisabledUntilTimestamp) {
			const timeoutEnd = member.communicationDisabledUntilTimestamp
			if (timeoutEnd > Date.now()) {
				isTimedOut = true
				logger.debug(`User ${userId} is currently timed out and eligible for appeal`)
			}
		}

		if (!isBanned && !isTimedOut) {
			logger.debug(`User ${userId} is neither banned nor timed out, cannot appeal`)

			const notEligibleEmbed = new EmbedBuilder()
				.setTitle('Error | Appeal Not Eligible')
				.setDescription('You can only submit an appeal if you are banned or currently timed out.')
				.setColor(config.embeds.colors.warning)
				.setTimestamp()

			return interaction.reply({ embeds: [notEligibleEmbed], flags: MessageFlags.Ephemeral })
		}

		let appeals = getAppeals()
		if (appeals.includes(userId)) {
			logger.debug(`User ${userId} has already submitted an appeal request`)

			const alreadySubmittedEmbed = new EmbedBuilder()
				.setTitle('Error | Duplicate Submission')
				.setDescription('You already have a pending appeal. Please wait for it to be reviewed.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [alreadySubmittedEmbed], flags: MessageFlags.Ephemeral })
		}

		const modal = client.modals.get('modal_appeal')
		if (!modal) {
			logger.debug('Appeal modal not found')

			const modalErrorEmbed = new EmbedBuilder()
				.setTitle('Error | Appeal Modal Not Found')
				.setDescription('The appeal submission form could not be found.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [modalErrorEmbed], flags: MessageFlags.Ephemeral })
		}

		await modal.execute(interaction)
		logger.debug(`Appeal modal executed successfully for user ${userId}`)
	},
}
