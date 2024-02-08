import { ApiBuilderInput, ApiBuilderOutput, PaginatedQuery } from '../../../core/utils/routes-manager';
import { AvailableServices } from '../../../services';
import { AvailableHooks } from '../../hooks';
import { BookSchemas } from './book.validation';

export async function BookApiBuilder({
	services,
	hooks,
}: ApiBuilderInput<AvailableHooks, AvailableServices>): Promise<ApiBuilderOutput> {
	const { bookService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BookSchemas.GetAllBooks,
			// preHandler: [hooks.tokenRequired],
			handler: async ({ query }) => {
				const { limit = -1, page = 1 } = query as PaginatedQuery;
				return {
					status: true,
					data: { books: await bookService.getAll() },
				};
			},
		},
		{
			url: '/:bookId',
			method: 'GET',
			schema: BookSchemas.GetBook,
			// preHandler: [hooks.tokenRequired],
			handler: async ({ params }) => {
				const { bookId } = params as any;
				const book = await bookService.getById(bookId);
				return book
					? {
							status: true,
							data: { book },
						}
					: { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
			},
		},
		{
			url: '/',
			method: 'POST',
			schema: BookSchemas.AddBook,
			// preHandler: [hooks.tokenRequired],
			handler: async ({ body }) => {
				try {
					const book = await bookService.add(body as any);
					return {
						status: true,
						data: { book },
					};
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
			// preHandler: [hooks.tokenRequired],
			handler: async ({ params, body }) => {
				const { bookId } = params as any;

				const [affectedCount, affectedRows] = await bookService.update(bookId, body as any);
				return affectedCount
					? {
							status: true,
							data: { book: affectedRows[0] },
						}
					: {
							status: false,
							error: {
								type: 'ENTITY_NOT_FOUND',
							},
						};
			},
		},
		{
			url: '/:bookId',
			method: 'DELETE',
			schema: BookSchemas.DeleteBook,
			// preHandler: [hooks.tokenRequired],
			handler: async ({ params}) => {
				const { bookId } = params as any;
				const isDeleted = await bookService.delete(bookId);
				return isDeleted ? { status: true, data: {} } : { status: false, error: { type: 'ENTITY_NOT_FOUND' } };
			},
		},
	];
}
