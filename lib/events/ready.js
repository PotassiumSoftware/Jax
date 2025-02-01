module.exports = {
	name: 'ready',
	once: true,
	execute() {
		logger.info(`Logged in as ${client.user.tag}!`)
	},
}
