import fastify, { FastifyInstance } from 'fastify';
import { syncDatabase } from '../database/server';
import { loggers } from './utils';

/**
 * Options for configuring the Application.
 */
interface ApplicationOptions {
	host: string;
	port: number;
}

/**
 * The main Application class responsible for managing Fastify app and HTTP server.
 */
export class Application {
	/**
	 * The Fastify application instance.
	 * @private
	 */
	private readonly _instance: FastifyInstance;

	/**
	 * Creates an instance of the Application class.
	 */
	constructor() {
		this._instance = fastify();
	}

	/**
	 * Initializes the application by loading modules and registering routes.
	 * @returns {Promise<void>} A Promise indicating the completion of initialization.
	 */
	public async initialize(): Promise<void> {
		await syncDatabase();
	}

	/**
	 * Gets the Fastify application instance.
	 * @returns {FastifyInstance} The Fastify application instance.
	 */
	public get instance(): FastifyInstance {
		return this._instance;
	}

	/**
	 * Starts listening on the specified host and port.
	 * @param {ApplicationOptions} options - Options for configuring the host and port.
	 * @param {(err: Error | null, address: string) => void} [callback] - An optional callback function to execute when the server is started.
	 * @returns {Application} The current Application instance.
	 */
	public listen(options: ApplicationOptions, callback?: (err: Error | null, address: string) => void): Application {
		const { host, port } = options;

		// Default callback logging the server address
		const defaultCallback = (error: Error | null, address: string) => {
			if (error) {
				loggers.application.error('Error starting the server:', error);
				process.exit(1); // Terminate the process on error
			} else {
				loggers.application.info(`Server listening on: ${address}`);
			}
		};

		this._instance.listen({ port, host }, callback || defaultCallback);
		return this;
	}
}