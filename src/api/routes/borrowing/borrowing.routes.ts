import { Parser } from '@json2csv/plainjs';
import { BorrowingSchemas } from './borrowing.validation';

type TBorrowABookBody = { bookId: string; dueDate: Date };
type TReportStatusInput = {startDate: string;endDate: string;};

export async function BorrowingApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { borrowingService } = services;

	return [
		{
			url: '/',
			method: 'GET',
			schema: BorrowingSchemas.GetAllBorrowings,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ query }: HandlerParameter<{ query: PaginatedQuery }>) => {
				const { limit = -1, page = 1 } = query;
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
			handler: async ({ body, locals }: HandlerParameter<{ body: TBorrowABookBody }>) => {
				const { UID } = locals;
				const { status, message } = await borrowingService.borrowABook({ borrowerId: UID, ...body });
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
			handler: async ({ body, locals }: HandlerParameter<{ body: { bookId: string } }>) => {
				const { UID } = locals;
				const { bookId } = body;

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
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async () => {
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
		{
			url: '/report-status',
			method: 'GET',
			schema: BorrowingSchemas.ReportStatus,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ query }: HandlerParameter<{ query: TReportStatusInput }>) => {
				const { startDate, endDate } = query;
				const parser = new Parser();
				const borrowings = await borrowingService.reportStatus({
					startDate: new Date(startDate),
					endDate: new Date(endDate),
				});
				const csv = parser.parse(JSON.parse(JSON.stringify(borrowings)));

				return {
					status: true,
					data: { borrowings },
					file: csv,
					headers: {
						'Content-Type': 'text/csv',
						'Content-Disposition': `attachment; filename="report-${Date.now()}"`,
					},
				};
			},
		},
		{
			url: '/last-month-borrowing-processes',
			method: 'GET',
			schema: BorrowingSchemas.LastMonthBorrowingProcess,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ }) => {
				const borrowings = await borrowingService.borrowingProcessesLastNDays({ days: 30 });
				if (!borrowings.length)
					return {
						status: true,
						data: { borrowings },
						file: 'nothing to show',
						headers: {
							'Content-Type': 'text/csv',
							'Content-Disposition': `attachment; filename="report-${Date.now()}"`,
						},
					};
				const parser = new Parser();
				const csv = parser.parse(JSON.parse(JSON.stringify(borrowings)));

				return {
					status: true,
					data: { borrowings },
					file: csv,
					headers: {
						'Content-Type': 'text/csv',
						'Content-Disposition': `attachment; filename="report-${Date.now()}"`,
					},
				};
			},
		},
		{
			url: '/last-month-overdue-borrowing-processes',
			method: 'GET',
			schema: BorrowingSchemas.LastMonthOverdueBorrowingProcess,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({  }) => {
				const borrowings = await borrowingService.borrowingProcessesLastNDays({ days: 120, onlyOverDue: true });
				if (!borrowings.length)
					return {
						status: true,
						data: { borrowings },
						file: 'nothing to show',
						headers: {
							'Content-Type': 'text/csv',
							'Content-Disposition': `attachment; filename="report-${Date.now()}"`,
						},
					};
				const parser = new Parser();
				const csv = parser.parse(JSON.parse(JSON.stringify(borrowings)));

				return {
					status: true,
					data: { borrowings },
					file: csv,
					headers: {
						'Content-Type': 'text/csv',
						'Content-Disposition': `attachment; filename="report-${Date.now()}"`,
					},
				};
			},
		},
	];
}
