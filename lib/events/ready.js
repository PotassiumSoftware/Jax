module.exports = {
	name: 'ready',
	once: true,
	execute() {
		console.log(`Logged in as ${client.user.tag}!`);
	},
}
