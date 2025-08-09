import app from "#configs/app";
const {logging} = app;
class Logger {
	constructor() {
		this.level = logging.level;
		this.levels = {
			error: 0,
			warn: 1,
			info: 2,
			debug: 3,
		};
	}

	shouldLog(level) {
		return this.levels[level] <= this.levels[this.level];
	}

	formatMessage(level, message, meta = {}) {
		const timestamp = new Date().toISOString();

		if (typeof message === "object") {
			message = JSON.stringify(message, null, 2);
		}

		const logEntry = {
			timestamp,
			level: level.toUpperCase(),
			message,
			...meta,
		};

		if (logging.format === "json") {
			return JSON.stringify(logEntry);
		}

		let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
		if (Object.keys(meta).length > 0) {
			formatted += ` | ${JSON.stringify(meta)}`;
		}
		return formatted;
	}

	error(message, meta = {}) {
		if (this.shouldLog("error")) {
			console.log(this.formatMessage("error", message, meta));
		}
	}

	warn(message, meta = {}) {
		if (this.shouldLog("warn")) {
			console.log(this.formatMessage("warn", message, meta));
		}
	}

	info(message, meta = {}) {
		if (this.shouldLog("info")) {
			console.log(this.formatMessage("info", message, meta));
		}
	}

	debug(message, meta = {}) {
		if (this.shouldLog("debug")) {
			console.log(this.formatMessage("debug", message, meta));
		}
	}
}

export default new Logger();