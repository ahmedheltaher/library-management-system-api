import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

const borrowingProperties = {
	name: { type: 'string', minLength: 3, maxLength: 100 },
	email: { type: 'string', minLength: 3, maxLength: 100 },
};

export const BorrowingDefinitions = {
	Borrowing: {
		$id: '$Borrowing',
		type: 'object',
		properties: {
			checkoutDate: { type: 'string', format: 'date-time' },
			dueDate: { type: 'string', format: 'date-time' },
			returnDate: { type: 'string', format: 'date-time', nullable: true },
			borrower: {
				type: 'object',
				properties: { id: { type: 'string', format: 'uuid' }, name: { type: 'string' } },
				required: ['id', 'name'],
			},
			book: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					title: { type: 'string' },
					author: { type: 'string' },
					ISBN: { type: 'string' },
				},
				required: ['id', 'title', 'author', 'ISBN'],
			},
		},
		required: ['checkoutDate', 'dueDate', 'borrower', 'book'],
		additionalProperties: false,
	},

	BorrowingCreate: {
		$id: '$BorrowingCreate',
		type: 'object',
		properties: {
			bookId: { type: 'string', format: 'uuid' },
			dueDate: { type: 'string', format: 'date-time' },
		},
		required: ['bookId', 'dueDate'],
		additionalProperties: false,
	},

	BorrowingReturn: {
		$id: '$BorrowingReturn',
		type: 'object',
		properties: {
			bookId: { type: 'string', format: 'uuid' },
		},
		required: ['bookId'],
		additionalProperties: false,
	},

	MyBorrowings: {
		$id: '$MyBorrowings',
		type: 'object',
		properties: {
			checkoutDate: { type: 'string', format: 'date-time' },
			dueDate: { type: 'string', format: 'date-time' },
			returnDate: { type: 'string', format: 'date-time', nullable: true },
			book: {
				type: 'object',
				properties: {
					id: { type: 'string', format: 'uuid' },
					title: { type: 'string' },
					author: { type: 'string' },
					ISBN: { type: 'string' },
				},
				required: ['id', 'title', 'author', 'ISBN'],
			},
		},
		required: ['checkoutDate', 'dueDate', 'book'],
		additionalProperties: false,
	},
};

export const BorrowingSchemas = EntitySchema({
	GetAllBorrowings: {
		description: 'Retrieve all Borrowings in the system with optional pagination support.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$Borrowing' } } },
			errors: ['401'],
		}),
	},

	BorrowABook: {
		description: 'Borrow a book from the lib',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		body: { $ref: '$BorrowingCreate' },
		response: GetResponses({
			successResponse: { message: { type: 'string' } },
			errors: ['401'],
		}),
	},
	ReturnBook: {
		description: 'Return a borrowed book to the lib',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		body: { $ref: '$BorrowingReturn' },
		response: GetResponses({
			successResponse: { message: { type: 'string' } },
			errors: ['401'],
		}),
	},

	MyBorrowings: {
		description: 'Retrieve all Borrowings by the authenticated user with optional pagination support.',
		tags: ['Borrowing'],
		querystring: { $ref: '$PaginatedQuery' },
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$MyBorrowings' } } },
			errors: ['401'],
		}),
	},

	GetOverDueBorrowings: {
		description: 'Retrieve all Borrowings in the system that are over due with optional pagination support.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$Borrowing' } } },
			errors: ['401'],
		}),
	},

	GetMyOverDueBorrowings: {
		description: 'Retrieve all Borrowings by the authenticated user that are over due with optional pagination support.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$MyBorrowings' } } },
			errors: ['401'],
		}),
	},
});
