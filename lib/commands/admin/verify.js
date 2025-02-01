const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const config = require('../../../config/main.json')
const userVerify = require('../../events/userVerify.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Manually verify a user')
		.addUserOption(option => option.setName('user').setDescription('The user to verify').setRequired(true)),

	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			const errorEmbed = new EmbedBuilder()
				.setTitle('Error | Permission Denied')
				.setDescription('You do not have the required permissions to execute this command.')
				.addFields({ name: 'Missing Permissions', value: '`MANAGE_ROLES`' })
				.setColor(config.embeds.colors.error)
				.setTimestamp()

			return interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral })
		}

		const userId = interaction.options.getUser('user').id
		const reviewer = interaction.user.id

		userVerify.execute(userId, 'manual', reviewer, interaction)

		const embed = new EmbedBuilder().setTitle('Manual Verification').setDescription(`Successfully approved <@${userId}> for verification!`).setColor(config.embeds.colors.success).setTimestamp()

		await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral })
	},
}
