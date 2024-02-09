import { LibrarianSchemas } from './librarian.validation';

export async function LibrarianApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { librarianService } = services;
	return [
		{
			url: '/login',
			method: 'POST',
			schema: LibrarianSchemas.Login,
			handler: async ({ body }) => {
				const { status, token } = await librarianService.login(body as any);
				if (!status) {
					return {
						status: false,
						error: { type: 'UNAUTHENTICATED', details: { message: 'Invalid email or password' } },
					};
				}
				return { status: true, data: { token } };
			},
		},
	];
}
