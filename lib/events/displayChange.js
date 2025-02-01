const { EmbedBuilder } = require('discord.js')
const config = require('../../config/main.json')

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldMember, newMember) {
		if (newMember.user.bot) return

		const channel = client.guilds.cache.get(config.guildId)?.channels.cache.get(config.logging.users)
		if (!channel) {
			logger.error('Logging channel not found in the test guild!')
			return
		}

		logger.debug(`Member update detected for ${newMember.user.tag} (${newMember.user.id})`)

		if (oldMember.nickname !== newMember.nickname) {
			const avatarURL = newMember.user.displayAvatarURL({ dynamic: true, size: 1024 })

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${newMember.user.displayName} (${newMember.user.username})`,
					iconURL: avatarURL,
				})
				.setTitle('Nickname Update')
				.setColor(config.embeds.colors.default)
				.setDescription(`**Previous Nickname:** \`${oldMember.nickname || 'None'}\`\n**New Nickname:** \`${newMember.nickname || 'None'}\``)
				.setFooter({ text: `User ID: ${newMember.id}` })
				.setTimestamp()

			try {
				await channel.send({ embeds: [embed] })
				logger.debug(`Nickname update message sent for ${newMember.user.tag}`)
			} catch (error) {
				logger.error('Failed to send log message:', error)
			}
		} else {
			logger.debug(`No nickname change detected for ${newMember.user.tag}`)
		}
	},
}
