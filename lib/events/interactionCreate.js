const { PermissionsBitField, EmbedBuilder, MessageFlags } = require('discord.js')
const config = require('../../config/main.json')
const permissionNames = require('../../config/perms.json')

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return

		const command = interaction.client.commands.get(interaction.commandName)
		if (!command) return

		const { permissions = [] } = command

		if (interaction.guild) {
			const member = interaction.member
			if (!member) return

			const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator)

			if (!isAdmin && permissions.length > 0) {
				const missingPermissions = permissions.filter(perm => !member.permissions.has(perm))

				if (missingPermissions.length > 0) {
					const permissionNamesList = missingPermissions
						.map(perm => {
							const permName = permissionNames[perm]
							return permName ? permName : `UNKNOWN_PERMISSION (${perm})`
						})
						.join(', ')

					const errorEmbed = new EmbedBuilder()
						.setTitle('Error | Permission Denied')
						.setDescription('You do not have the required permissions to execute this command.')
						.addFields({
							name: 'Missing Permissions',
							value: `\`${permissionNamesList}\``,
						})
						.setColor(config.embeds.colors.error)
						.setTimestamp()

					logger.debug(`User ${interaction.user.tag} attempted to use command ${interaction.commandName} without required permissions: ${permissionNamesList}`)

					return interaction.reply({
						embeds: [errorEmbed],
						flags: MessageFlags.Ephemeral,
					})
				}
			}
		}

		try {
			await command.execute(interaction)
		} catch (error) {
			logger.error('Error executing command:', error)

			const errorEmbed = new EmbedBuilder()
				.setTitle('Error | Command Execution Failed')
				.setDescription('There was an error while executing this command.')
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			await interaction
				.reply({
					embeds: [errorEmbed],
					flags: MessageFlags.Ephemeral,
				})
				.catch(() => {
					interaction.followUp({
						embeds: [errorEmbed],
						flags: MessageFlags.Ephemeral,
					})
				})
		}
	},
}
