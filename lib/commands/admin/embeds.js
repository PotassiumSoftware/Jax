const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, MessageFlags, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const rules = require('../../../config/rules.json');
const config = require('../../../config/main.json');

function createEmbed(data) {
    return new EmbedBuilder()
        .setColor(config.embeds.colors.default || null)
        .setTitle(data.title || null)
        .setURL(data.url || null)
        .setAuthor(data.author || null)
        .setDescription(data.description || null)
        .setThumbnail(data.thumbnail || null)
        .addFields(...(data.fields || []))
        .setImage(data.image || null)
        .setFooter(data.footer || null);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embeds')
        .setDescription('Sends either the rules or verification embed(s).')
        .addStringOption(option =>
            option.setName('type').setDescription('Choose the type of embed to send.').setRequired(true).addChoices({ name: 'Rules', value: 'rules' }, { name: 'Verification', value: 'verification' }),
        ),
    permissions: [PermissionsBitField.Flags.ManageMessages],
    async execute(interaction) {
        const embedType = interaction.options.getString('type');

        const embeds = Object.values(rules).map(createEmbed);
        for (const embed of embeds) {
            await interaction.channel.send({ embeds: [embed] });
        }

        if (embedType === 'verification') {
            const finalEmbed = new EmbedBuilder()
                .setTitle('Verification Process')
                .setColor(config.embeds.colors.default)
                .setDescription(
                    "Welcome to our community! To complete your verification, please follow the steps outlined below:\n\n- Click the 'Verify' button to begin.\n- Complete the questionnaire with accurate information.\n- Wait for a staff member to review and approve your submission.",
                )
                .setFooter({ text: 'If you have any issues, please contact a moderator.' });

            const verifyButton = new ButtonBuilder().setCustomId('button_verify').setLabel('Verify').setStyle('Primary');

            const row = new ActionRowBuilder().addComponents(verifyButton);

            await interaction.channel.send({ embeds: [finalEmbed], components: [row] });
        }

        await interaction.reply({
            content: 'Sending embed(s)!',
            flags: MessageFlags.Ephemeral,
        });
    },
};
