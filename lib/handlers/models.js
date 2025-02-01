const { Collection, Events } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')

module.exports = client => {
	if (!client.modals) {
		client.modals = new Collection()
	}

	const modalFiles = readdirSync(path.join(__dirname, '../modals')).filter(file => file.endsWith('.ts') || file.endsWith('.js'))

	modalFiles.forEach(file => {
		const modal = require(path.join(__dirname, `../modals/${file}`))
		if (modal.data && modal.data.customId) {
			client.modals.set(modal.data.customId, modal)
			logger.debug(`Loaded modal: ${modal.data.customId} from file: ${file}`)
		} else {
			logger.warn(`Modal file ${file} is missing a valid 'data.customId' property.`)
		}
	})

	client.on(Events.InteractionCreate, async interaction => {
		if (!interaction.isModalSubmit()) return

		const modal = client.modals.get(interaction.customId)
		if (!modal) return

		try {
			logger.debug(`Processing modal interaction: ${interaction.customId}`)
			await modal.execute(interaction)
		} catch (error) {
			logger.error(`Error executing modal interaction: ${interaction.customId}`, error)
		}
	})
}
