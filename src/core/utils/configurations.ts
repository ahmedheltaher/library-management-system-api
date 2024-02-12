import * as dotenv from "dotenv";

// Load environment variables from .env file
const environmentResult = dotenv.config();
if (environmentResult.error) {
	throw new Error(
		"Failed to load environment variables from .env file. Please check the file exists and has valid syntax"
	);
}

/**
 * Parses an environment variable as an integer with a default value.
 *
 * @param key - The name of the environment variable to parse
 * @param defaultValue - The default value to use if the env var is not set or invalid
 * @returns The parsed integer value or the default value
 */
const parseEnvironmentInteger = (key: string, defaultValue: number) => {
	const value = process.env[key];
	const parsedValue = parseInt(value, 10);
	return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
};

export const configurations = {
	server: {
		port: parseEnvironmentInteger('SERVER_PORT', 3000),
		host: process.env.SERVER_HOST || '127.0.0.1',
	},
	nodeEnvironment: process.env.NODE_ENV || 'development',

	database: {
		database: process.env.DATABASE_NAME || '',
		password: process.env.DATABASE_PASSWORD || '',
		host: process.env.DATABASE_HOST || '',
		user: process.env.DATABASE_USER || '',
		port: parseEnvironmentInteger('DATABASE_PORT', 1433),
		force: process.env.DATABASE_FORCE_SYNC === 'true',
	},

	jwt: {
		secret: process.env.JWT_SECRET || '123',
		tokenDuration: {
			long: 60 * 60 * 24 * 30, // 30 Days Validity
			short: 60 * 60 * 24, // 1 Day Validity
		},
	},

	logs: {
		level: process.env.LOG_LEVEL || 'silly',
	},

	api: {
		prefix: '/api',
		version: '/v1',
	},

	redis: {
		host: process.env.REDIS_HOST || 'localhost',
		port: parseEnvironmentInteger('REDIS_PORT', 6379),
	},

	bcrypt: { saltOrRounds: 8 },

	isDevelopmentEnvironment() {
		return (process.env.NODE_ENV || '').toUpperCase() === 'DEVELOPMENT';
	},
};
