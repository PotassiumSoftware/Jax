const { EmbedBuilder, Client } = require('discord.js')
const config = require('../../config/main.json')

module.exports = {
	name: 'userUpdate',
	async execute(oldUser, newUser) {
		if (newUser.bot) return

		const channel = client.guilds.cache.get(config.guildId)?.channels.cache.get(config.logging.users)
		if (!channel) {
			logger.error('Logging channel not found in guild!')
			return
		}

		logger.debug(`User update detected for ${newUser.tag} (${newUser.id})`)

		if (oldUser.avatar !== newUser.avatar) {
			const avatarURL = newUser.displayAvatarURL({ dynamic: true, size: 1024 })

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${newUser.displayName} (${newUser.username})`,
					iconURL: avatarURL,
				})
				.setTitle('Avatar Update')
				.setColor(config.embeds.colors.default)
				.setDescription(`<@${newUser.id}> has updated their avatar!`)
				.setThumbnail(avatarURL)
				.setFooter({ text: `User ID: ${newUser.id}` })
				.setTimestamp()

			try {
				await channel.send({ embeds: [embed] })
				logger.debug(`Avatar update message sent for ${newUser.tag}`)
			} catch (error) {
				logger.error('Failed to send log message:', error)
			}
		} else {
			logger.debug(`No avatar change detected for ${newUser.tag}`)
		}
	},
}
