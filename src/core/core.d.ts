import 'fastify';
import { FastifyRequest, FastifySchema, HTTPMethods, preHandlerAsyncHookHandler } from 'fastify';
import Redis from 'ioredis';
import { HandlerResult, configurations } from './utils';

declare module 'fastify' {
	interface FastifyReply {
		locals: Record<string, any>;
	}
	interface FastifyContextConfig {
		rateLimit?: rateLimiter.RouteRateLimitOptions | false;
	}
}

declare global {
	namespace rateLimiter {
		// Define rate limit options interface
		interface RateLimitOptions {
			limit: number; // Maximum number of requests allowed
			interval: number; // Time window in seconds
			redisClient: Redis;
		}

		interface RouteRateLimitOptions {
			limit?: number; // Maximum number of requests allowed
			interval?: number; // Time window in seconds
		}
	}

	/**
	 * Type representing different parts of a request.
	 */
	type RequestParts = {
		body: FastifyRequest['body'];
		headers: FastifyRequest['headers'];
		query: FastifyRequest['query'];
		params: FastifyRequest['params'];
		locals: Record<string, any>;
	};

	/**
	 * Type representing application configurations.
	 */
	export type Configurations = typeof configurations;

	/**
	 * Type representing custom route options.
	 */
	export type CustomRouteOptions = {
		url: string;
		method: HTTPMethods;
		schema?: FastifySchema;
		preHandler?: Array<preHandlerAsyncHookHandler>;
		handler: (request: RequestParts) => Promise<HandlerResult>;
	};

	/**
	 * Type representing input data for building APIs.
	 */
	export type ApiBuilderInput = {
		configurations: Configurations;
		hooks: AvailableHooks;
		services: AvailableServices;
	};

	/**
	 * Type representing input data for registering APIs.
	 */
	export type RegisterApiInput = { prefix: string; routes: Array<CustomRouteOptions> };

	/**
	 * Type representing output data from building APIs.
	 */
	export type ApiBuilderOutput = Array<CustomRouteOptions>;

	/**
	 * Type representing input data for building hooks.
	 */
	export type HookBuilderInput = {
		configurations: Configurations;
		services: AvailableServices;
	};
}
