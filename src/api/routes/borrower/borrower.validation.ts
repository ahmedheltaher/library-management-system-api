import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

const borrowerProperties = {
	name: { type: 'string', minLength: 3, maxLength: 100 },
	email: { type: 'string', minLength: 3, maxLength: 100, format: 'email' },
};

export const BorrowerDefinitions = {
	Borrower: {
		$id: '$Borrower',
		type: 'object',
		properties: {
			id: { type: 'string', format: 'uuid' },
			...borrowerProperties,
			registrationDate: { type: 'string', format: 'date-time' },
		},
		additionalProperties: false,
	},
	BorrowerCreate: {
		$id: '$BorrowerCreate',
		type: 'object',
		properties: {
			...borrowerProperties,
			password: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['name', 'email', 'password'],
		additionalProperties: false,
	},
	BorrowerLogin: {
		$id: '$BorrowerLogin',
		type: 'object',
		properties: {
			email: { type: 'string', minLength: 3, maxLength: 100, format: 'email' },
			password: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['email', 'password'],
		additionalProperties: false,
	},
	BorrowerChangeEmail: {
		$id: '$BorrowerChangeEmail',
		type: 'object',
		properties: {
			currentPassword: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
			newEmail: { type: 'string', minLength: 3, maxLength: 100, format: 'email' },
		},
		required: ['newEmail', 'currentPassword'],
		additionalProperties: false,
	},
	BorrowerChangePassword: {
		$id: '$BorrowerChangePassword',
		type: 'object',
		properties: {
			currentPassword: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
			newPassword: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['newPassword', 'currentPassword'],
		additionalProperties: false,
	},
	DeleteBorrowerAccount: {
		$id: '$DeleteBorrowerAccount',
		type: 'object',
		properties: {
			currentPassword: { type: 'string', minLength: 3, maxLength: 100, format: 'password' },
		},
		required: ['currentPassword'],
		additionalProperties: false,
	},
};

export const BorrowerSchemas = EntitySchema({
	GetAllBorrowers: {
		description: 'Retrieve all Borrowers in the system with optional pagination support.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrower'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowers: { type: 'array', items: { $ref: '$Borrower' } } },
			errors: ['401'],
		}),
	},
	Register: {
		description: 'Register Borrower in the system',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},

	Login: {
		description: 'Login to Access the functionally of the system',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerLogin' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { token: { type: 'string' } }, errors: ['401'] }),
	},
	ChangeEmail: {
		description: 'Change Borrower Email',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerChangeEmail' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
	ChangePassword: {
		description: 'Change Borrower Password',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerChangePassword' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},

	DeleteAccount: {
		description: 'Delete Borrower Account',
		tags: ['Borrower'],
		body: { $ref: '$DeleteBorrowerAccount' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
});
