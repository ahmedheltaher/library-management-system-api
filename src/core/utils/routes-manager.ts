import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse, configurations, stripSlashes } from '.';

/**
 * Type representing routes with their prefix and build handler function.
 */
type TRoutes = Array<{
	prefix: string;
	buildHandler: (_: ApiBuilderInput) => Promise<ApiBuilderOutput>;
}>;

/**
 * Type representing input data for loading routes.
 */
type TLoadRoutes = {
	routes: TRoutes;
	hooks: AvailableHooks;
	services: AvailableServices;
};

/**
 * Utility class to manage loading routes.
 */
export class RoutesManager {
	private constructor() {}

	/**
	 * Load routes based on the provided routes, hooks, and services.
	 * @param routes - Routes to load.
	 * @param hooks - Hooks to apply.
	 * @param services - Services to use.
	 * @returns Loaded routes.
	 */
	static async LoadRoutes({ routes, hooks, services }: TLoadRoutes) {
		const builtRoutes = [];
		for await (const { prefix, buildHandler } of routes) {
			const fullPrefix = `/${configurations.api.version}/${stripSlashes(prefix)}`;
			const rowRoutes = await buildHandler({ configurations, hooks, services });
			for (const route of rowRoutes) {
				const url = `/${stripSlashes(`${configurations.api.prefix}/${stripSlashes(fullPrefix)}/${stripSlashes(route.url)}`)}`;

				const handler = async (request: FastifyRequest, reply: FastifyReply) => {
					const result = await route.handler({
						body: request.body || {},
						headers: request.headers as { [key: string]: string },
						query: request.query as { [key: string]: string },
						params: request.params as { [key: string]: string | string[] },
						locals: reply.locals,
					});
					const { code, body, headers } = GenerateResponse({ responseInput: result });

					for (const headerName in headers) reply.header(headerName, headers[headerName]);

					if (reply.locals.headers) {
						for (const headerName in reply.locals.headers)
							reply.header(headerName, reply.locals.headers[headerName]);
					}

					return reply.code(code).send(body);
				};
				builtRoutes.push({ ...route, url, handler });
			}
		}
		return builtRoutes;
	}
}
