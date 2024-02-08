import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
	swagger: {
		info: {
			title: 'KeyJat Server',
			description: 'The APIs for KeyJat',
			version: '0.1.0',
		},
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [
			{ name: 'Application', description: 'Application related end-points' },
			{ name: 'User', description: 'User related end-points' },

			{ name: 'Web', description: 'Web related end-points' },
			{ name: 'Mobile', description: 'Mobile related end-points' },
		],
		securityDefinitions: {
			apiKey: { type: 'apiKey', name: 'x-session-key', in: 'header' },
		},
	},
};
