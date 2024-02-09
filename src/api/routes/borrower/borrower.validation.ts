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
		summary: 'Retrieve all borrowers with optional pagination',
		description:
			'`**Only For Librarian**` This endpoint retrieves a list of all registered borrowers in the system. Pagination support is available for managing large datasets.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrower'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowers: { type: 'array', items: { $ref: '$Borrower' } } },
			errors: ['401'],
		}),
	},
	Register: {
		summary: 'Register a new borrower account',
		description:
			'This endpoint allows a new user to register as a borrower in the system. Upon successful registration, the user gains access to the borrowing functionalities.',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
	Login: {
		summary: 'Login to access the system functionalities',
		description:
			'This endpoint facilitates the login process for registered borrowers. Upon successful login, the system provides an authentication token for accessing the functionalities.',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerLogin' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { token: { type: 'string' } }, errors: ['401'] }),
	},
	ChangeEmail: {
		summary: 'Change borrower email address',
		description:
			'This endpoint allows a borrower to change their registered email address. The current password must be provided for authentication and security purposes.',
		tags: ['Borrower'],
		body: { $ref: '$BorrowerChangeEmail' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
	ChangePassword: {
		summary: 'Change borrower account password',
		description:
			"This endpoint enables a borrower to update their account password. The current password is required for authentication, and the new password must meet the system's security criteria.",
		tags: ['Borrower'],
		body: { $ref: '$BorrowerChangePassword' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
	DeleteAccount: {
		summary: 'Delete borrower account',
		description:
			"This endpoint permanently deletes a borrower's account from the system. To proceed, the borrower must provide their current password for authentication.",
		tags: ['Borrower'],
		body: { $ref: '$DeleteBorrowerAccount' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
});
