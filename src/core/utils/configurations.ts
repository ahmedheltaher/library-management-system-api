import dotenv from 'dotenv';

const environmentData = dotenv.config();

if (environmentData.error) {
	throw new Error("Couldn't find .env file");
}

const parseEnvironmentInteger = (key: string, defaultValue: number) =>
	parseInt(process.env[key] || '', 10) || defaultValue;

const configurations = {
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

	bcrypt: { saltOrRounds: 8 },

	isDevelopmentEnvironment() {
		return (process.env.NODE_ENV || '').toUpperCase() === 'DEVELOPMENT';
	},
};

export { configurations };
