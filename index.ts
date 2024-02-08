import { Application, configurations, loggers } from './src/core';

async function Main() {
	try {
		const applicationInstance = new Application();
		await applicationInstance.initialize();

		applicationInstance.listen({ port: configurations.server.port, host: configurations.server.host });
	} catch (error) {
		loggers.exceptions.error(`Error during application startup: ${error}`);
		process.exit(1);
	}
}

Main();
