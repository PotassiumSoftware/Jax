const winston = require('winston')
const { combine, printf, colorize, timestamp } = winston.format
const DailyRotateFile = require('winston-daily-rotate-file')
const config = require('../../config/main.json')

const colors = {
	debug: 'green',
	info: 'blue',
	warn: 'yellow',
	error: 'red',
}

winston.addColors(colors)

const logFormat = printf(({ level, message, timestamp }) => {
	return `[${timestamp}] - [${level}]: ${message}`
})

const timestampFormat = () => {
	const now = new Date()
	return now
		.toLocaleString('en-GB', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		})
		.replace(',', '')
}

const logger = winston.createLogger({
	level: 'debug',
	format: combine(timestamp({ format: timestampFormat }), logFormat),
	transports: [
		new winston.transports.Console({
			format: combine(colorize({ all: true }), timestamp({ format: timestampFormat }), logFormat),
			level: config.debug ? 'debug' : 'info',
		}),
		new DailyRotateFile({
			filename: 'logs/console-%DATE%.log',
			datePattern: 'YYYY-MM-DD',
			level: 'debug',
			zippedArchive: true,
		}),
	],
})

module.exports = logger
