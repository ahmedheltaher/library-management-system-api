import { EntitySchema, GetResponses } from '../../../core/validations/helpers';

// TODO: Make More Clean
const tags = ['Borrower'];

export const BorrowerSchemas = EntitySchema({
	Register: {
		description: 'Register Borrower in the system',
		querystring: { $ref: '$PaginatedQuery' },
		tags,
		// security: [{ apiKey: [] }],
		response: GetResponses({
			successResponse: { applications: { type: 'array', items: {type:'string'} } },
			errors: ['401'],
		}),
	},
});
