const { EmbedBuilder, Client } = require('discord.js')
const config = require('../../config/main.json')

module.exports = {
	name: 'guildMemberUpdate',
	async execute(oldUser, newUser) {
		if (newUser.bot) return

		const channel = newUser.client.guilds.cache.get(config.guildId)?.channels.cache.get(config.logging.users)
		if (!channel) {
			console.error('Logging channel not found in the test guild!')
			return
		}

		if (oldUser.avatar !== newUser.avatar) {
			const avatarURL = newUser.user.displayAvatarURL({ dynamic: true, size: 1024 })

			const embed = new EmbedBuilder()
				.setAuthor({
					name: `${newUser.user.displayName} (${newUser.user.username})`,
					iconURL: avatarURL,
				})
				.setTitle('Guild Avatar Update')
				.setColor(config.embeds.colors.default)
				.setDescription(`<@${newUser.id}> has updated their avatar!`)
				.setThumbnail(newUser.displayAvatarURL({ dynamic: true, size: 1024 }))
				.setFooter({ text: `User ID: ${newUser.id}` })
				.setTimestamp()

			try {
				await channel.send({ embeds: [embed] })
			} catch (error) {
				console.error('Failed to send log message:', error)
			}
		}
	},
}
