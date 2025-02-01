const { Collection } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')

module.exports = client => {
	if (!client.buttons) {
		client.buttons = new Collection()
		logger.debug('Initialized buttons collection.')
	}

	const buttonFiles = readdirSync(path.join(__dirname, '../buttons')).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

	buttonFiles.forEach(file => {
		const button = require(path.join(__dirname, `../buttons/${file}`))
		if (button.data && button.data.customId) {
			client.buttons.set(button.data.customId, button)
			logger.debug(`Loaded button: ${button.data.customId} from file: ${file}`)
		} else {
			logger.warn(`Button file ${file} is missing a valid 'data.customId' property.`)
		}
	})

	client.on('interactionCreate', async interaction => {
		if (!interaction.isButton()) return

		const button = client.buttons.get(interaction.customId)
		if (!button) {
			logger.warn(`No handler found for button interaction with customId: ${interaction.customId}`)
			return
		}

		try {
			logger.debug(`Executing button interaction: ${interaction.customId}`)
			await button.execute(interaction)
		} catch (error) {
			logger.error(`Error executing button interaction: ${interaction.customId}`, error)
		}
	})
}
