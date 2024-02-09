import { Model, Op, Sequelize } from 'sequelize';
import { configurations, loggers } from '../../core';

export const sequelizeConnection = new Sequelize({
	dialect: 'postgres',
	host: configurations.database.host,
	database: configurations.database.database,
	username: configurations.database.user,
	password: configurations.database.password,
	port: configurations.database.port,
	pool: { max: 20, min: 0, acquire: 30_000, idle: 10_000 },
	logging: (message: string) => loggers.database.info(message),
	benchmark: true,
	operatorsAliases: {
		$like: Op.like,
		$ne: Op.ne,
		$eq: Op.eq,
		$lt: Op.lt
	},
});

async function syncModel(model: typeof Model, force: boolean) {
	try {
		await model.sync({ force });
		loggers.database.info(`Synced ${model.name} successfully`);
	} catch (error: any) {
		loggers.database.error(`Error syncing ${model.name}: ${error.message}`);
		throw error;
	}
}

async function initializeModels(force: boolean) {
	const models = sequelizeConnection.modelManager.models;

	for (const model of models) {
		await syncModel(model, force);
	}

	loggers.database.info(`Models Count: ${models.length}`);
}

export async function syncDatabase() {
	try {
		await sequelizeConnection.sync({});
		await initializeModels(configurations.database.force);
	} catch (error) {
		loggers.database.error(error);
		process.exit(1);
	}
}
