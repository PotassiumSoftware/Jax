const { Client, GatewayIntentBits } = require('discord.js')
const { readdirSync } = require('fs')
const path = require('path')
const config = require('../config/main.json')

global.client = new Client({
	intents: [
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
	],
})

const loadHandlers = () => {
	try {
		const handlerFiles = readdirSync(path.join(__dirname, 'handlers')).filter(file => file.endsWith('.js'))

		for (const file of handlerFiles) {
			const handler = require(path.join(__dirname, 'handlers', file))
			if (typeof handler === 'function') {
				handler(global.client)
			}
		}
	} catch (error) {
		console.error('Error reading handlers directory:', error)
	}
}

loadHandlers()

global.client.login(config.token)
