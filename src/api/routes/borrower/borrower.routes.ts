import { ApiBuilderInput, ApiBuilderOutput, PaginatedQuery } from '../../../core/utils/routes-manager';
import { AvailableServices } from '../../../services';
import { AvailableHooks } from '../../hooks';
import { BorrowerSchemas } from './borrower.validation';

export async function BorrowerApiBuilder({
	services,
	hooks,
}: ApiBuilderInput<AvailableHooks, AvailableServices>): Promise<ApiBuilderOutput> {
	const { bookService } = services;
	return [
		{
			url: '/',
			method: 'POST',
			schema: BorrowerSchemas.Register,
			// preHandler: [hooks.tokenRequired],
			handler: async ({ query }) => {
				const { limit = -1, page = 1 } = query as PaginatedQuery;
				return {
					status: true,
					data: { applications: await bookService.getAll() },
				};
			},
		},
	];
}
