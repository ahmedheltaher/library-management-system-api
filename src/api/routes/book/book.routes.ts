import { ApiBuilderInput, ApiBuilderOutput } from '../../../core/utils/routes-manager';
import { BookSchemas } from './book.validation';

export async function BookApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { bookService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BookSchemas.GetAllBooks,
			preHandler: [hooks.tokenRequired],
			handler: async ({ query }) => {
				const { limit = -1, page = 1 } = query as PaginatedQuery;
				return {
					status: true,
					data: { books: await bookService.getAll({ limit, offset: (page - 1) * limit }) },
				};
			},
		},
		{
			url: '/:bookId',
			method: 'GET',
			schema: BookSchemas.GetBook,
			preHandler: [hooks.tokenRequired],
			handler: async ({ params }) => {
				const { bookId } = params as any;
				const book = await bookService.getById(bookId);
				if (!book) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { book } };
			},
		},
		{
			url: '/get-by-ISBN/:ISBN',
			method: 'GET',
			schema: BookSchemas.GetBookByISBN,
			preHandler: [hooks.tokenRequired],
			handler: async ({ params }) => {
				const { ISBN } = params as any;
				const book = await bookService.getByISBN(ISBN);
				if (!book) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { book } };
			},
		},
		{
			url: '/get-by-title/:title',
			method: 'GET',
			schema: BookSchemas.GetBookByTitle,
			preHandler: [hooks.tokenRequired],
			handler: async ({ params }) => {
				const { title } = params as any;
				const books = await bookService.getByTitle(title);
				if (!books?.length) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { books } };
			},
		},
		{
			url: '/get-by-author/:author',
			method: 'GET',
			schema: BookSchemas.GetBookByAuthor,
			preHandler: [hooks.tokenRequired],
			handler: async ({ params }) => {
				const { author } = params as any;
				const books = await bookService.getByAuthor(author);
				if (!books?.length) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { books } };
			},
		},
		{
			url: '/',
			method: 'POST',
			schema: BookSchemas.AddBook,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ body }) => {
				try {
					const book = await bookService.add(body as any);
					return { status: true, data: { book } };
				} catch (error: any) {
					return {
						status: false,
						error: {
							type: 'CONFLICT',
							details: {
								message: 'Looks Like there is already a book with the same ISBN',
							},
						},
					};
				}
			},
		},
		{
			url: '/:bookId',
			method: 'PUT',
			schema: BookSchemas.UpdateBook,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ params, body }) => {
				const { bookId } = params as any;

				const [affectedCount, affectedRows] = await bookService.update(bookId, body as any);
				if (!affectedCount) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: { book: affectedRows[0] } };
			},
		},
		{
			url: '/:bookId',
			method: 'DELETE',
			schema: BookSchemas.DeleteBook,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ params }) => {
				const { bookId } = params as any;
				const isDeleted = await bookService.delete(bookId);
				if (!isDeleted) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: {} };
			},
		},
	];
}
