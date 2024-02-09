import { ApiBuilderInput, ApiBuilderOutput } from '../../../core/utils/routes-manager';
import { BorrowingSchemas } from './borrowing.validation';

export async function BorrowingApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { borrowingService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BorrowingSchemas.GetAllBorrowings,
			preHandler: [hooks.tokenRequired, hooks.adminsOnly],
			handler: async ({ query }) => {
				const { limit = -1, page = 1 } = query as PaginatedQuery;
				return {
					status: true,
					data: { borrowings: await borrowingService.getAll({ limit, offset: (page - 1) * limit }) },
				};
			},
		},
		{
			url: '/borrow-a-book',
			method: 'POST',
			schema: BorrowingSchemas.BorrowABook,
			preHandler: [hooks.tokenRequired],
			handler: async ({ body, locals }) => {
				const { UID } = locals;
				const { bookId, dueDate } = body as any;
				const { status, message } = await borrowingService.borrowABook({ borrowerId: UID, bookId, dueDate });
				if (!status) {
					return { status: false, error: { type: 'INVALID_INPUT', details: { message } } };
				}
				return { status: true, data: { message } };
			},
		},
		{
			url: '/return-book',
			method: 'POST',
			schema: BorrowingSchemas.ReturnBook,
			preHandler: [hooks.tokenRequired],
			handler: async ({ body, locals }) => {
				const { UID } = locals;
				const { bookId } = body as any;
				const { status, message } = await borrowingService.returnBook({ borrowerId: UID, bookId });
				if (!status) {
					return { status: false, error: { type: 'INVALID_INPUT', details: { message } } };
				}
				return { status: true, data: { message } };
			},
		},
		{
			url: '/my-borrowings',
			method: 'GET',
			schema: BorrowingSchemas.MyBorrowings,
			preHandler: [hooks.tokenRequired],
			handler: async ({ locals }) => {
				const { UID } = locals;
				const borrowings = await borrowingService.getByBorrowerId(UID);
				return { status: true, data: { borrowings } };
			},
		},
		{
			url: '/over-due-borrowings',
			method: 'GET',
			schema: BorrowingSchemas.GetOverDueBorrowings,
			preHandler: [hooks.tokenRequired],
			handler: async ({}) => {
				const borrowings = await borrowingService.getOverDueBorrowings();
				return { status: true, data: { borrowings } };
			},
		},
		{
			url: '/my-over-due-borrowings',
			method: 'GET',
			schema: BorrowingSchemas.GetMyOverDueBorrowings,
			preHandler: [hooks.tokenRequired],
			handler: async ({ locals }) => {
				const { UID } = locals;
				const borrowings = await borrowingService.getUserOverDueBorrowings(UID);
				return { status: true, data: { borrowings } };
			},
		},
	];
}
