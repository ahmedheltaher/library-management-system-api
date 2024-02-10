import { FastifyPluginCallback, FastifyReply, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';

const _rateLimitPlugin: FastifyPluginCallback<rateLimiter.RateLimitOptions> = (fastify, options, done) => {
	const rateLimitMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
		const ipAddress = request.ip;
		let { limit, interval, redisClient } = options;

		if (request.routeOptions.config.rateLimit) {
			limit = request.routeOptions.config.rateLimit.limit || limit;
			interval = request.routeOptions.config.rateLimit.interval || interval;
		}

		const key = `rate-limit:${ipAddress}`;
		const currentCount = await redisClient.incr(key);
		redisClient.expire(key, interval);

		if (currentCount > limit) {
			reply.code(429).send({
				error: 'Rate limit exceeded. Too many requests.',
			});
		} else {
			reply.locals.headers = {
				'X-RateLimit-Limit': limit,
				'X-RateLimit-Remaining': limit - currentCount,
				'X-RateLimit-Reset': interval,
			};
		}
	};
	fastify.addHook('preHandler', rateLimitMiddleware);
	done();
};

export const rateLimitPlugin = fp(_rateLimitPlugin);
