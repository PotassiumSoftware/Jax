const { PermissionsBitField } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;

    const { cooldown = 0, permissions = [] } = command;
    const member = interaction.member;

    if (!member) return;

    const isAdmin = member.permissions.has(PermissionsBitField.Flags.Administrator);

    if (!isAdmin && permissions.length > 0) {
      const missingPermissions = permissions.filter((perm) => !member.permissions.has(perm));

      if (missingPermissions.length > 0) {
        const permissionNames = missingPermissions
          .map((perm) => PermissionsBitField.resolve(perm) || "Unknown Permission")
          .join(", ");

        return interaction.reply({
          content: `You are missing the following permissions: ${permissionNames}`,
          ephemeral: true,
        });
      }
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error executing this command.",
        ephemeral: true,
      });
    }
  },
};
