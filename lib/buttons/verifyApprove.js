const { MessageFlags, EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../../config/main.json');
const userVerify = require('../events/userVerify.js');

module.exports = {
    data: {
        customId: 'button_verify_approve',
    },
    async execute(interaction) {
        const userId = interaction.user.id;
        const footer = interaction.message.embeds[0]?.footer?.text;
        const reviewer = interaction.user.id;

        logger.debug(`Approval initiated by ${interaction.user.tag} (ID: ${userId})`);

        if (interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {

            userVerify.execute(userId, 'approve', reviewer, interaction);

            const approve = new ButtonBuilder()
                .setCustomId('button_verify_approve')
                .setLabel('Approve')
                .setStyle(ButtonStyle.Success)
                .setDisabled(true);

            const deny = new ButtonBuilder()
                .setCustomId('button_verify_deny')
                .setLabel('Deny')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true);

            const avatar = new ButtonBuilder()
                .setLabel('Avatar')
                .setStyle(ButtonStyle.Link)
                .setURL(`https://lens.google.com/uploadbyurl?url=https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.png`);

            const tools = new ActionRowBuilder().addComponents(approve, deny, avatar);

            await interaction.update({
                components: [tools],
            });

            logger.debug(`Interaction updated with approval buttons for user ${userId}`);

            return interaction.followUp({
                content: `Approved Verification Submission for <@${userId}>`,
                flags: MessageFlags.Ephemeral,
            });
        } else {
            logger.debug(`User ${userId} does not have the required permissions to approve verification`);

            const errorEmbed = new EmbedBuilder()
                .setTitle('Error | Permission Denied')
                .setDescription('You do not have the required permissions to execute this command.')
                .addFields({
                    name: 'Missing Permissions',
                    value: '`MANAGE_ROLES`',
                })
                .setColor(config.embeds.colors.error)
                .setTimestamp();

            return interaction.reply({
                embeds: [errorEmbed],
                flags: MessageFlags.Ephemeral,
            });
        }
    },
};
