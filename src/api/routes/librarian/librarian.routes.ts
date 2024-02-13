import { TLibrarianLoginInput } from '../../../services';
import { LibrarianSchemas } from './librarian.validation';

export async function LibrarianApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { librarianService } = services;
	return [
		{
			url: '/login',
			method: 'POST',
			schema: LibrarianSchemas.Login,
			config: { rateLimit: { limit: 5, interval: 60 } },
			handler: async ({ body }: HandlerParameter<{ body: TLibrarianLoginInput }>) => {
				const { status, token } = await librarianService.login(body);
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
