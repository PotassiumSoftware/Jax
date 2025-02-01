const { MessageFlags, EmbedBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const config = require('../../config/main.json');

const verificationsFile = path.join(__dirname, '../../data/verifications.json');

const getVerifications = () => {
    const data = fs.readFileSync(verificationsFile, 'utf8');
    return JSON.parse(data);
};

module.exports = {
    data: {
        customId: 'button_verify',
    },
    async execute(interaction) {
        const modal = interaction.client.modals.get('model_verify');
        const userId = interaction.user.id;

        logger.debug(`Verification initiated by ${interaction.user.tag} (ID: ${userId})`);

        let verifications = getVerifications();

        if (verifications.includes(userId)) {
            const alreadySubmittedEmbed = new EmbedBuilder()
                .setTitle('Error | Duplicate Submission')
                .setDescription('You already have a pending verification request. Please wait for it to be processed.')
                .setColor(config.embeds.colors.error)
                .setTimestamp();

            logger.debug(`User ${userId} has already submitted a verification request`);

            return interaction.reply({
                embeds: [alreadySubmittedEmbed],
                flags: MessageFlags.Ephemeral,
            });
        }

        if (!modal) {
            logger.debug('Verification modal not found');

            return interaction.reply({
                content: 'Verification modal not found.',
                flags: MessageFlags.Ephemeral,
            });
        }

        await modal.execute(interaction);

        logger.debug(`Verification modal executed successfully for user ${userId}`);
    },
};
