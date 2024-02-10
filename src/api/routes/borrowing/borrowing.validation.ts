import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

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
		summary: 'Retrieve all borrowings with optional pagination',
		description:
			'`**Only For Librarian**` This endpoint retrieves a list of all borrowings in the library system. Pagination support is provided for managing large collections of borrowings.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$Borrowing' } } },
			errors: ['401'],
		}),
	},

	BorrowABook: {
		summary: 'Borrow a book from the library',
		description:
			'This endpoint allows users to borrow a book from the library by providing the book ID and the due date for return.',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		body: { $ref: '$BorrowingCreate' },
		response: GetResponses({
			successResponse: { message: { type: 'string' } },
			errors: ['401'],
		}),
	},
	ReturnBook: {
		summary: 'Return a borrowed book to the library',
		description: 'This endpoint allows users to return a borrowed book to the library by providing the book ID.',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		body: { $ref: '$BorrowingReturn' },
		response: GetResponses({
			successResponse: { message: { type: 'string' } },
			errors: ['401'],
		}),
	},
	MyBorrowings: {
		summary: 'Retrieve all borrowings by the authenticated user with optional pagination',
		description:
			'This endpoint retrieves a list of all borrowings made by the authenticated user. Pagination support is provided for managing large collections of borrowings.',
		tags: ['Borrowing'],
		querystring: { $ref: '$PaginatedQuery' },
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$MyBorrowings' } } },
			errors: ['401'],
		}),
	},
	GetOverDueBorrowings: {
		summary: 'Retrieve all overdue borrowings in the system with optional pagination',
		description:
			'`**Only For Librarian**` This endpoint retrieves a list of all borrowings that are overdue in the library system. Pagination support is provided for managing large collections of overdue borrowings.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$Borrowing' } } },
			errors: ['401'],
		}),
	},
	GetMyOverDueBorrowings: {
		summary: 'Retrieve all overdue borrowings by the authenticated user with optional pagination',
		description:
			'This endpoint retrieves a list of all borrowings that are overdue and made by the authenticated user. Pagination support is provided for managing large collections of overdue borrowings.',
		querystring: { $ref: '$PaginatedQuery' },
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { borrowings: { type: 'array', items: { $ref: '$MyBorrowings' } } },
			errors: ['401'],
		}),
	},

	ReportStatus: {
		summary: 'Export all borrowings Between Two Dates',
		description:
			'`**Only For Librarian**` This endpoint exports a list of all borrowings Between Two Dates  in the library system. It will return as csv string.',
		querystring: {
			type: 'object',
			properties: {
				startDate: { type: 'string', format: 'date-time' },
				endDate: { type: 'string', format: 'date-time' },
			},
			required: ['startDate', 'endDate'],
			additionalProperties: false,
		},
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: {  },
			errors: ['401'],
		}),
	},

	LastMonthBorrowingProcess: {
		summary: 'Export all last month borrowings',
		description:
			'`**Only For Librarian**` This endpoint export a list of all borrowings happened last month in the library system. It will return as csv string.',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: {  },
			errors: ['401'],
		}),
	},LastMonthOverdueBorrowingProcess: {
		summary: 'Export all last month overdue borrowings',
		description:
			'`**Only For Librarian**` This endpoint export a list of all overdue borrowings happened last month in the library system. It will return as csv string.',
		tags: ['Borrowing'],
		security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: {  },
			errors: ['401'],
		}),
	},
});
