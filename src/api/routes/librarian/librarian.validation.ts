import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

export const LibrarianDefinitions = {
	LibrarianLogin: {
		$id: '$LibrarianLogin',
		type: 'object',
		properties: {
			email: { type: 'string', minLength: 3, maxLength: 100, format: 'email' },
			password: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['email', 'password'],
		additionalProperties: false,
	},
};

export const LibrarianSchemas = EntitySchema({
	Login: {
		summary: 'Login to access the system functionalities',
		description:
			'This endpoint facilitates the login process for registered Librarians. Upon successful login, the system provides an authentication token for accessing the functionalities.',
		tags: ['Librarian'],
		body: { $ref: '$LibrarianLogin' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { token: { type: 'string' } }, errors: ['401'] }),
	},
});
