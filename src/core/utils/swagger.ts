import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
	swagger: {
		info: {
			title: '',
			description:
				'This API provides endpoints for managing a library system, including operations related to books, borrowers, borrowing, and librarian functionalities.',
			version: '0.1.0',
		},
		schemes: ['http'],
		consumes: ['application/json'],
		produces: ['application/json'],
		tags: [
			{ name: 'Book', description: 'Endpoints related to managing books in the library system' },
			{ name: 'Borrower', description: 'Endpoints related to managing borrowers in the library system' },
			{
				name: 'Borrowing',
				description: 'Endpoints related to borrowing and returning books in the library system',
			},
			{ name: 'Librarian', description: 'Endpoints related to librarian functionalities in the library system' },
		],
		securityDefinitions: {
			apiKey: { type: 'apiKey', name: 'authentication', in: 'header' },
		},
	},
};
