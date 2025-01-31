const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionsBitField,
	MessageFlags,
	ActionRowBuilder,
	ButtonBuilder,
} = require('discord.js')
const rules = require('../../../config/rules.json')
const config = require('../../../config/main.json')

function createEmbed(data) {
	const embed = new EmbedBuilder()

	if (config.embeds.colors.default) embed.setColor(config.embeds.colors.default)
	if (data.title) embed.setTitle(data.title)
	if (data.url) embed.setURL(data.url)
	if (data.author) embed.setAuthor(data.author)
	if (data.description) embed.setDescription(data.description)
	if (data.thumbnail) embed.setThumbnail(data.thumbnail)
	if (data.fields) embed.addFields(...data.fields)
	if (data.image) embed.setImage(data.image)
	if (data.footer) embed.setFooter(data.footer)

	return embed
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('embeds')
		.setDescription('Sends either the rules or verification embed(s).')
		.addStringOption(option =>
			option
				.setName('type')
				.setDescription('Choose the type of embed to send.')
				.setRequired(true)
				.addChoices({ name: 'Rules', value: 'rules' }, { name: 'Verification', value: 'verification' }),
		),
	permissions: [PermissionsBitField.Flags.ManageMessages],
	async execute(interaction) {
		const embedType = interaction.options.getString('type')

		if (embedType === 'rules') {
			const embeds = Object.values(rules).map(createEmbed)
			for (const embed of embeds) {
				await interaction.channel.send({ embeds: [embed] })
			}
			await interaction.reply({
				content: 'Sending embed(s)!',
				flags: MessageFlags.Ephemeral,
			})
		} else if (embedType === 'verification') {
			const finalEmbed = new EmbedBuilder()
				.setTitle('Verification Process')
				.setColor(config.embeds.colors.default)
				.setDescription(
					"Welcome to our community! To complete your verification, please follow the steps outlined below:\n\n- Click the 'Verify' button to begin.\n- Complete the questionnaire with accurate information.\n- Wait for a staff member to review and approve your submission.",
				)
				.setFooter({
					text: 'If you have any issues, please contact a moderator.',
				})

			const verifyButton = new ButtonBuilder().setCustomId('button_verify').setLabel('Verify').setStyle('Primary')

			const row = new ActionRowBuilder().addComponents(verifyButton)

			await interaction.channel.send({
				embeds: [finalEmbed],
				components: [row],
			})

			await interaction.reply({
				content: 'Sending embed(s)!',
				flags: MessageFlags.Ephemeral,
			})
		}
	},
}
