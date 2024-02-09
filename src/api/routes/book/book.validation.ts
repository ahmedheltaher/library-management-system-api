import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

const bookProperties = {
	title: { type: 'string', minLength: 3, maxLength: 100 },
	author: { type: 'string', minLength: 3, maxLength: 100 },
	ISBN: { type: 'string', minLength: 3, maxLength: 100 },
	availableQuantity: { type: 'number', minimum: 0, default: 1 },
	shelfLocation: { type: 'string', minLength: 3, maxLength: 100 },
};

export const BooksDefinitions = {
	Book: {
		$id: '$Book',
		type: 'object',
		properties: { id: { type: 'string', format: 'uuid' }, ...bookProperties },
		additionalProperties: false,
	},
	BookCreate: {
		$id: '$BookCreate',
		type: 'object',
		properties: bookProperties,
		required: ['title', 'author', 'ISBN', 'availableQuantity', 'shelfLocation'],
		additionalProperties: false,
	},
	BookUpdate: {
		$id: '$BookUpdate',
		type: 'object',
		properties: bookProperties,
		additionalProperties: false,
	},
	BookIdInput: {
		$id: '$BookIdInput',
		type: 'object',
		properties: { bookId: { type: 'string', format: 'uuid' } },
		required: ['bookId'],
		additionalProperties: false,
	},
	BookISBNInput: {
		$id: '$BookISBNInput',
		type: 'object',
		properties: { ISBN: { type: 'string' } },
		required: ['ISBN'],
		additionalProperties: false,
	},
	BookTitleInput: {
		$id: '$BookTitleInput',
		type: 'object',
		properties: { title: { type: 'string' } },
		required: ['title'],
		additionalProperties: false,
	},
	BookAuthorInput: {
		$id: '$BookAuthorInput',
		type: 'object',
		properties: { author: { type: 'string' } },
		required: ['author'],
		additionalProperties: false,
	},
};

export const BookSchemas = EntitySchema({
	GetAllBooks: {
		description: 'Retrieve all books in the system with optional pagination support.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	GetBook: {
		description: 'Retrieve details of a book by its ID.',
		params: { $ref: '$BookIdInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	GetBookByISBN: {
		description: 'Retrieve details of a book by its ISBN.',
		params: { $ref: '$BookISBNInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	GetBookByTitle: {
		description: 'Retrieve details of books by matching or similar title.',
		params: { $ref: '$BookTitleInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	GetBookByAuthor: {
		description: 'Retrieve details of books by matching or similar author.',
		params: { $ref: '$BookAuthorInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	AddBook: {
		description: 'Add a new book to the library.',
		tags: ['Book'],
		body: { $ref: '$BookCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	UpdateBook: {
		description: 'Update details of a book by its ID.',
		tags: ['Book'],
		params: { $ref: '$BookIdInput' },
		body: { $ref: '$BookUpdate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	DeleteBook: {
		description: 'Delete a book by its ID.',
		params: { $ref: '$BookIdInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: {}, errors: ['401'] }),
	},
});
