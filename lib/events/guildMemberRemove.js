const { EmbedBuilder } = require('discord.js')
const config = require('../../config/main.json')

module.exports = {
	name: 'guildMemberRemove',
	async execute(member) {
		if (member.guild.id !== config.guildId) return;

		const channel = member.client.guilds.cache.get(config.guildId)?.channels.cache.get(config.logging.users)
		if (!channel) {
			logger.error('Logging channel not found in guild!')
			return
		}

		const avatarURL = member.displayAvatarURL({ dynamic: true, size: 1024 })
		logger.debug(`${member.user.tag} left guild ${member.guild.id}`)

		const isBot = member.user.bot

		const embed = new EmbedBuilder()
			.setAuthor({
				name: `${member.displayName} (${member.user.username})`,
				iconURL: avatarURL,
			})
			.setTitle(isBot ? 'Bot Removed' : 'Member Left')
			.setColor(config.embeds.colors.default)
			.setDescription(isBot ? `This user is a bot.` : `**Server Member Count:** ${member.guild.memberCount}\n**Account Created:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:f>`)
			.setThumbnail(avatarURL)
			.setFooter({ text: `User ID: ${member.id}` })
			.setTimestamp()

		try {
			await channel.send({ embeds: [embed] })
			logger.debug(`New ${isBot ? 'bot' : 'user'} leave message sent for ${member.user.tag}`)
		} catch (error) {
			logger.error('Failed to send log message:', error)
		}
	},
}
