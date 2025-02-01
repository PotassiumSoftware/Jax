const { EmbedBuilder } = require('discord.js')
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

const createLogEmbed = (type, userId, reviewer) => {
	const titles = {
		approve: 'Verification Approved',
		deny: 'Verification Denied',
		manual: 'Manual Verification',
	}

	const colors = {
		approve: config.embeds.colors.success,
		manual: config.embeds.colors.warning,
		deny: config.embeds.colors.error,
	}

	return new EmbedBuilder()
		.setTitle(titles[type] || 'Unknown Action')
		.addFields({ name: 'User', value: `<@${userId}>`, inline: true }, { name: 'Reviewer', value: `<@${reviewer}>`, inline: true })
		.setColor(colors[type] || config.embeds.colors.default)
		.setTimestamp()
}

module.exports = {
	name: 'userVerify',
	async execute(userId, type, reviewer, interaction) {
		let verifications = getVerifications()
		verifications = verifications.filter(id => id !== userId) 
		saveVerifications(verifications)

		const logChannel = interaction.guild.channels.cache.get(config.logging.verification)

		if (!['approve', 'deny', 'manual'].includes(type)) {
			console.log(`Invalid type received for user ${userId}.`)
			return
		}

		const logEmbed = createLogEmbed(type, userId, reviewer)

		if (type === 'approve' || type === 'manual') {
			const roleId = config.roles.approved
			const member = await interaction.guild.members.fetch(userId)

			if (member) {
				try {
					await member.roles.add(roleId)
					console.log(`Assigned the approved role to <@${userId}>`)
				} catch (error) {
					console.error(`Failed to assign role to <@${userId}>: ${error.message}`)
				}
			} else {
				console.log(`Could not find member <@${userId}>`)
			}
		}

		if (logChannel) {
			await logChannel.send({ embeds: [logEmbed] })
		}
	},
}
