const { Pool } = require('pg')
const fs = require('fs')
const config = require('../../config/main.json')

logger.debug(`Setting up PostgreSQL connection with database: ${config.database.name} at ${config.database.host}:${config.database.port}`)

const pool = new Pool({
	user: config.database.user,
	host: config.database.host,
	database: config.database.name,
	password: config.database.password,
	port: config.database.port,
	connectionTimeoutMillis: 5000, 
	idleTimeoutMillis: 10000, 
	max: 20, 
	min: 4, 
	ssl: { rejectUnauthorized: config.database.ssl },
})

pool.on('connect', client => {
	logger.debug(`Connected to the PostgreSQL database: ${config.database.name}`)
})

pool.on('error', (err, client) => {
	logger.error(`Unexpected error on idle client: ${err.message}`)
	setTimeout(() => {
		logger.debug('Attempting to reconnect to the PostgreSQL database...')
		pool.connect()
			.then(() => {
				logger.debug('Reconnected to the PostgreSQL database.')
			})
			.catch(reconnectError => {
				logger.error(`Reconnection failed: ${reconnectError.message}`)
			})
	}, 5000)
})

async function performQuery() {
	const client = await pool.connect()
	try {
		const res = await client.query('SELECT NOW()')
	} catch (err) {
		logger.error('Error executing query', err.stack)
	} finally {
		client.release()
	}
}

performQuery()

module.exports = { pool }

