import pino, { Level } from 'pino';
import PinoPretty from 'pino-pretty';

/**
 * Input configuration for creating a logger.
 */
type CreateLoggerInput = {
	filename?: string;
	level: Level;
	logToConsole?: boolean;
	logToFile?: boolean;
};

/**
 * Creates a logger with flexible configuration options.
 * @param options - Configuration options for the logger.
 * @returns The configured logger.
 */
const createLogger = ({ filename, level, logToConsole = true, logToFile = true }: CreateLoggerInput) => {
	const streams = [];

	if (logToFile) {
		streams.push({
			stream: pino.destination({ dest: `logs/${filename}.log`, append: true, sync: true }),
			level,
		});
	}

	if (logToConsole) {
		streams.push({
			stream: PinoPretty({
				colorize: true,
				sync: true,
				append: true,
				colorizeObjects: true,
			}),
		});
	}

	return pino(
		{
			formatters: { level: (label) => ({ level: label }) },
			timestamp: pino.stdTimeFunctions.isoTime,
			level,
		},
		pino.multistream(streams)
	);
};

export const loggers = {
	requests: createLogger({ filename: 'requests', level: 'trace', logToConsole: false }),
	exceptions: createLogger({ filename: 'exceptions', level: 'trace', logToConsole: true }),
	database: createLogger({ filename: 'database', level: 'trace', logToConsole: true }),
	redis: createLogger({ filename: 'redis', level: 'trace', logToConsole: true }),
	application: createLogger({ filename: 'application', level: 'trace', logToFile: false }),
};
