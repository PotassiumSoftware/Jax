const { EmbedBuilder } = require('discord.js');
const config = require('../../config/main.json');

module.exports = {
  name: 'userUpdate',
  async execute(oldUser, newUser) {
    if (newUser.bot) return;

    const channel = client.guilds.cache.get(config.guildId)?.channels.cache.get(config.logging.users);
    if (!channel) {
      logger.warn('Logging channel not found in the test guild!');
      return;
    }

    if (oldUser.username !== newUser.username) {
      const avatarURL = newUser.displayAvatarURL({ dynamic: true, size: 1024 });

      const embed = new EmbedBuilder()
        .setAuthor({
          name: `${newUser.displayName} (${newUser.username})`,
          iconURL: avatarURL,
        })
        .setTitle('Username Update')
        .setColor(config.embeds.colors.default)
        .setDescription(`**Previous Username:** \`${oldUser.username}\`\n**New Username:** \`${newUser.username}\``)
        .setFooter({ text: `User ID: ${newUser.id}` })
        .setTimestamp();

      try {
        await channel.send({ embeds: [embed] });
        logger.debug(`Successfully logged username change for ${newUser.username} (${newUser.id})`);
      } catch (error) {
        logger.error('Failed to send log message:', error);
      }
    }
  },
};
