const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js')
const modalData = require('../../config/verification.json')

module.exports = {
	data: {
		customId: 'model_verify',
	},
	async execute(interaction) {
		if (!modalData) {
			return interaction.reply({
				content: 'Error loading modal data.',
				ephemeral: true,
			})
		}

		if (!Array.isArray(modalData.fields)) {
			return interaction.reply({
				content: 'Error: "fields" is not an array.',
				ephemeral: true,
			})
		}

		const modal = new ModalBuilder().setCustomId('model_verify').setTitle(modalData.title)

		const components = modalData.fields.map(field => {
			const styleEnumKey = field.style
			const style = TextInputStyle[styleEnumKey.toUpperCase()]

			const input = new TextInputBuilder()
				.setCustomId(field.customId)
				.setLabel(field.label)
				.setStyle(style || TextInputStyle.Paragraph)
				.setRequired(field.required || false)
				.setMaxLength(field.maxLength || 1000)
				.setMinLength(field.minLength || 10)
				.setPlaceholder(field.placeholder || 'Enter text here.')

			return new ActionRowBuilder().addComponents(input)
		})

		modal.addComponents(...components)

		if (!interaction.isModalSubmit()) {
			interaction.showModal(modal)
		}
	},
}
