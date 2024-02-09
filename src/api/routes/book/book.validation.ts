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
		summary: 'Retrieve all books with optional pagination',
		description:
			'This endpoint retrieves a list of all books available in the library system. Pagination support is provided for managing large collections of books.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	GetBook: {
		summary: 'Retrieve book details by ID',
		description:
			'This endpoint retrieves detailed information about a specific book in the library system based on its unique identifier.',
		params: { $ref: '$BookIdInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	GetBookByISBN: {
		summary: 'Retrieve book details by ISBN',
		description:
			'This endpoint fetches detailed information about a book in the library system using its International Standard Book Number (ISBN).',
		params: { $ref: '$BookISBNInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	GetBookByTitle: {
		summary: 'Retrieve book details by title',
		description:
			'This endpoint retrieves detailed information about books in the library system by matching or similar titles.',
		params: { $ref: '$BookTitleInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	GetBookByAuthor: {
		summary: 'Retrieve book details by author',
		description:
			'This endpoint retrieves detailed information about books in the library system by matching or similar author names.',
		params: { $ref: '$BookAuthorInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { books: { type: 'array', items: { $ref: '$Book' } } },
			errors: ['401'],
		}),
	},
	AddBook: {
		summary: 'Add a new book to the library',
		description:
			'`**Only For Librarian**`  This endpoint allows librarians to add a new book to the library system, providing all necessary details including title, author, ISBN, available quantity, and shelf location.',
		tags: ['Book'],
		body: { $ref: '$BookCreate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	UpdateBook: {
		summary: 'Update book details by ID',
		description:
			'`**Only For Librarian**`  This endpoint enables librarians to update the details of a book in the library system based on its unique identifier.',
		tags: ['Book'],
		params: { $ref: '$BookIdInput' },
		body: { $ref: '$BookUpdate' },
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { book: { $ref: '$Book' } }, errors: ['401'] }),
	},
	DeleteBook: {
		summary: 'Delete a book by ID',
		description:
			'`**Only For Librarian**` This endpoint allows librarians to permanently remove a book from the library system based on its unique identifier.',
		params: { $ref: '$BookIdInput' },
		tags: ['Book'],
		security: [{ apiKey: [] }],
		response: GetResponses({ successResponse: { message: { type: 'string' } }, errors: ['401'] }),
	},
});
