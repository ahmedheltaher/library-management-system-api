import { FastifyReply, FastifySchema, HTTPMethods, preHandlerAsyncHookHandler } from 'fastify';
import { GenerateResponse, HandlerResult, configurations, stripSlashes } from '.';
import { FastifyRequest } from 'fastify';
import { AvailableHooks } from '../../api/hooks';
import { AvailableServices } from '../../services';

// TODO: Make it a better typed
export type RequestParts = {
	body: FastifyRequest['body'];
	headers: FastifyRequest['headers'];
	query: FastifyRequest['query'];
	params: FastifyRequest['params'];
};

export type Configurations = typeof configurations;

export type CustomRouteOptions = {
	url: string;
	method: HTTPMethods;
	schema?: FastifySchema;
	preHandler?: Array<preHandlerAsyncHookHandler>;
	handler: (request: RequestParts) => Promise<HandlerResult>;
};

export type ApiBuilderInput<AvailableHooks, AvailableServices> = {
	configurations: Configurations;
	hooks: AvailableHooks;
	services: AvailableServices;
};

export type RegisterApiInput = { prefix: string; routes: Array<CustomRouteOptions> };

export type ApiBuilderOutput = Array<CustomRouteOptions>;
export type PaginatedQuery = { limit: number; page: number };

export type HookBuilderInput<AvailableServices> = {
	configurations: Configurations;
	services: AvailableServices;
};

type TRoutes = Array<{
	prefix: string;
	buildHandler: (_: ApiBuilderInput<AvailableHooks, AvailableServices>) => Promise<ApiBuilderOutput>;
}>;

type TLoadRoutes = {
	routes: TRoutes;
	hooks: AvailableHooks;
	services: AvailableServices;
};

export class RoutesManager {
	private constructor() {}

	static async LoadRoutes({ routes, hooks, services }: TLoadRoutes) {
		const builtRoutes = [];
		for await (const { prefix, buildHandler } of routes) {
			const fullPrefix = `/${configurations.api.version}/${stripSlashes(prefix)}`;
			const rowRoutes = await buildHandler({ configurations, hooks, services });
			for (const route of rowRoutes) {
				builtRoutes.push({
					...route,
					url: `/${stripSlashes(`${configurations.api.prefix}/${stripSlashes(fullPrefix)}/${stripSlashes(route.url)}`)}`,
					handler: async (request: FastifyRequest, reply: FastifyReply) => {
						const result = await route.handler({
							body: request.body || {},
							headers: request.headers as { [key: string]: string },
							query: request.query as { [key: string]: string },
							params: request.params as { [key: string]: string | string[] },
						});
						const { code, body, headers } = GenerateResponse({ responseInput: result });

						for (const headerName in headers) reply.header(headerName, headers[headerName]);

						return reply.code(code).send(body);
					},
				});
			}
		}
		return builtRoutes;
	}
}
