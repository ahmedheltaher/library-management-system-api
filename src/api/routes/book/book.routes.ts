import { TBookCreate, TBookUpdate } from '../../../services';
import { BookSchemas } from './book.validation';

type TBookIDQuery = { bookId: string };
type TBookTitleQuery = { title: string };
type TBookAuthorQuery = { author: string };
type TBookISBNQuery = { ISBN: string };

export async function BookApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { bookService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BookSchemas.GetAllBooks,
			preHandler: [hooks.tokenRequired],
			handler: async ({ query }: HandlerParameter<{ query: PaginatedQuery }>) => {
				const { limit = -1, page = 1 } = query;
				const offset = (page - 1) * limit;
				const books = await bookService.getAll({ limit, offset });
				return { status: true, data: { books } };
			},
		},
		{
			url: '/:bookId',
			method: 'GET',
			schema: BookSchemas.GetBook,
			preHandler: [hooks.tokenRequired],
			handler: async ({ params }: HandlerParameter<{ params: TBookIDQuery }>) => {
				const { bookId } = params;
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
			handler: async ({ params }: HandlerParameter<{ params: TBookISBNQuery }>) => {
				const { ISBN } = params;
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
			handler: async ({ params }: HandlerParameter<{ params: TBookTitleQuery }>) => {
				const { title } = params;
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
			handler: async ({ params }: HandlerParameter<{ params: TBookAuthorQuery }>) => {
				const { author } = params;
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
			handler: async ({ body }: HandlerParameter<{ body: TBookCreate }>) => {
				try {
					const book = await bookService.add(body);
					return { status: true, data: { book } };
				} catch (error) {
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
			handler: async ({ params, body }: HandlerParameter<{ params: TBookIDQuery; body: TBookUpdate }>) => {
				const { bookId } = params;

				const [affectedCount, affectedRows] = await bookService.update(bookId, body);
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
			handler: async ({ params }: HandlerParameter<{ params: TBookIDQuery }>) => {
				const { bookId } = params;
				const isDeleted = await bookService.delete(bookId);
				if (!isDeleted) {
					return { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
				}
				return { status: true, data: {} };
			},
		},
	];
}
