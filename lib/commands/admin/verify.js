const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const config = require('../../../config/main.json');
const userVerify = require('../../events/userVerify.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verify')
        .setDescription('Manually verify a user')
        .addUserOption(option => option.setName('user').setDescription('The user to verify').setRequired(true)),
		permissions: [PermissionsBitField.Flags.ManageRoles],
    async execute(interaction) {
        const userId = interaction.options.getUser('user').id;
        const reviewer = interaction.user.id;

		logger.debug(`Attempting to verify user ${userId} by ${reviewer}`);

        try {
            await userVerify.execute(userId, 'manual', reviewer, interaction);

            const embed = new EmbedBuilder()
                .setTitle('Manual Verification')
                .setDescription(`Successfully approved <@${userId}> for verification!`)
                .setColor(config.embeds.colors.success)
                .setTimestamp();

            logger.debug(`User ${userId} successfully verified by ${reviewer}`);

            await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        } catch (error) {
            logger.error(`Error verifying user ${userId} by ${reviewer}: ${error.message}`);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error | Verification Failed')
                .setDescription(`An error occurred while verifying <@${userId}>.`)
                .setColor(config.embeds.colors.error)
                .setTimestamp();

            await interaction.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
        }
    },
};
