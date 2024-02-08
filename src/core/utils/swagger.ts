import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
	swagger: {
		info: {
			title: 'Library management system api',
			description: 'This API for Library management system',
			version: '0.1.0',
		},
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [
			{ name: 'Book', description: 'Book related end-points' },
			{ name: 'Borrower', description: 'Borrower related end-points' },
		],
		securityDefinitions: {
			apiKey: { type: 'apiKey', name: 'authentication', in: 'header' },
		},
	},
};
