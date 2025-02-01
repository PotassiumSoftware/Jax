const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { performance } = require('perf_hooks')
const { pool } = require('../../handlers/db.js')
const config = require('../../../config/main.json')

const data = new SlashCommandBuilder().setName('ping').setDescription('Replies with bot latency.')

async function execute(interaction) {
	const startTime = performance.now()
	await interaction.deferReply()

	let botPing = Math.round(performance.now() - startTime)
	if (botPing === -1) botPing = 'NaN'

	let apiPing = interaction.client.ws.ping
	if (apiPing === -1) apiPing = 'NaN'

	let dbPing = 'NaN'
	const dbStart = performance.now()

	try {
		const client = await pool.connect()

		await client.query('SELECT NOW()')
		dbPing = Math.round(performance.now() - dbStart)

		if (dbPing === -1) dbPing = 'NaN'

		client.release()
	} catch (err) {
		logger.error('Error with database ping:', err)
		dbPing = 'NaN'
	}

	const embed = new EmbedBuilder()
		.setTitle('Pong!')
		.setColor(config.embeds.colors.default)
		.addFields({ name: 'Bot Latency', value: `\`${botPing}\`ms` }, { name: 'API Latency', value: `\`${apiPing}\`ms` }, { name: 'Database Latency', value: `\`${dbPing}\`ms` })
		.setTimestamp()

	await interaction.editReply({ embeds: [embed] })
}

module.exports = { data, execute }
