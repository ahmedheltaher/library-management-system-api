import * as dotenv from "dotenv";

// Load environment variables from .env file
const environmentResult = dotenv.config();
if (environmentResult.error) {
	throw new Error(
		"Failed to load environment variables from .env file. Please check the file exists and has valid syntax"
	);
}

/**
 * Parses an environment variable as an integer, returning a default value if parsing fails.
 *
 * @param key - The name of the environment variable to parse.
 * @param defaultValue - The default value to return if parsing fails.
 * @returns The parsed integer value of the environment variable, or the default value if parsing failed.
 */
const parseEnvironmentInteger = (key: string, defaultValue: number) => {
	const value = process.env[key] || "";
	const parsedValue = parseInt(value, 10);
	return Number.isNaN(parsedValue) ? defaultValue : parsedValue;
};


export const configurations = {
	server: {
		port: parseEnvironmentInteger('SERVER_PORT', 3000),
		host: process.env.SERVER_HOST || '127.0.0.1',
		// TODO: Add support for CORS
		// cors: {
		// 	enabled: process.env.CORS_ENABLED === 'true',
		// 	allowedOrigins: process.env.CORS_ALLOWED_ORIGINS?.split(',') || [],
		// }
		// TODO: Add support for https
		// https: {
			// enabled: process.env.HTTPS_ENABLED === 'true',
			// port: parseEnvironmentInteger('HTTPS_PORT', 443),
			// key: process.env.HTTPS_KEY || '',
			// cert: process.env.HTTPS_CERT || '',
		// },
	},

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


	api: {
		prefix: '/api'
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
