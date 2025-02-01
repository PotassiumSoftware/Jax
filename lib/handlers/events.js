const { Client } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')

module.exports = client => {
	const eventFiles = readdirSync(path.join(__dirname, '../events')).filter(file => file.endsWith('.js'))

	eventFiles.forEach(file => {
		const event = require(path.join(__dirname, `../events/${file}`))

		logger.debug(`Loaded event: ${event.name} from file: ${file}`)

		if (event.once) {
			client.once(event.name, (...args) => {
				logger.debug(`Event once triggered: ${event.name}`)
				event.execute(...args)
			})
		} else {
			client.on(event.name, (...args) => {
				logger.debug(`Event triggered: ${event.name}`)
				event.execute(...args)
			})
		}
	})
}
