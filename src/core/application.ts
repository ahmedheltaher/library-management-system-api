import fastify, { FastifyInstance } from 'fastify';
import { syncDatabase } from '../database/server';
import { configurations, loggers, swaggerOptions, swaggerUIOptions, errorHandler } from './utils';
import { RoutesManager } from './utils/routes-manager';
import { GetServices } from '../services';
import { GetHooks } from '../api/hooks';
import { ApiDefinitions, routes } from '../api';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import { OpenAPIV2 } from 'openapi-types';
import { definitions } from './validations';

/**
 * Options for configuring the Application.
 */
interface ApplicationOptions {
	host: string;
	port: number;
}

export type InitializationParameters = {
	definitions: OpenAPIV2.DefinitionsObject;
};

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
		this._instance = fastify({
			frameworkErrors: errorHandler,
		});
	}

	private async initSwagger() {
		await this._instance.register(fastifySwagger, swaggerOptions);
		await this._instance.register(fastifySwaggerUI, swaggerUIOptions);
	}

	private async init(definitions: OpenAPIV2.DefinitionsObject) {
		if (configurations.isDevelopmentEnvironment()) await this.initSwagger();

		for (const definition in definitions) {
			this._instance.addSchema(definitions[definition]);
		}

		this._instance.setErrorHandler(errorHandler);

		const services = await GetServices(configurations);
		const hooks = await GetHooks({ configurations, services });
		const builtRoutes = await RoutesManager.LoadRoutes({ routes, hooks, services });
		for (const route of builtRoutes) {
			this._instance.route(route);
		}
	}

	/**
	 * Initializes the application by loading modules and registering routes.
	 * @returns {Promise<void>} A Promise indicating the completion of initialization.
	 */
	public async initialize(): Promise<void> {
		await syncDatabase();
		await this.init({ ...definitions, ...ApiDefinitions });
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
				loggers.application.error(`Error starting the server: ${error}`);
				process.exit(1); // Terminate the process on error
			} else {
				loggers.application.info(`Server listening on: ${address}`);
			}
		};

		this._instance.listen({ port, host }, callback || defaultCallback);
		return this;
	}
}
