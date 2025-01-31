const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
	MessageFlags,
} = require('discord.js');
const rules = require('../../../config/rules.json');
const config = require('../../../config/main.json');

function createEmbed(data) {
	const embed = new EmbedBuilder();

	if (config.embeds.colors.default)
		embed.setColor(config.embeds.colors.default);
	if (data.title) embed.setTitle(data.title);
	if (data.url) embed.setURL(data.url);
	if (data.author) embed.setAuthor(data.author);
	if (data.description) embed.setDescription(data.description);
	if (data.thumbnail) embed.setThumbnail(data.thumbnail);
	if (data.fields) embed.addFields(...data.fields);
	if (data.image) embed.setImage(data.image);
	if (data.footer) embed.setFooter(data.footer);

	return embed;
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rules')
		.setDescription('Sends the server rule embed!'),
	permissions: [PermissionsBitField.Flags.ManageMessages],
	async execute(interaction) {
		const embeds = Object.values(rules).map(createEmbed);

		for (const embed of embeds) {
			await interaction.channel.send({ embeds: [embed] });
		}

		await interaction.reply({
			content: 'Sending Embed(s)!',
			flags: MessageFlags.Ephemeral,
		});
	},
};
