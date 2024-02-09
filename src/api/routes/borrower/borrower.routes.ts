import { BorrowerSchemas } from './borrower.validation';

export async function BorrowerApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { borrowerService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BorrowerSchemas.GetAllBorrowers,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ query }) => {
				const { limit = -1, page = 1 } = query as PaginatedQuery;
				return {
					status: true,
					data: { borrowers: await borrowerService.getAll({ limit, offset: (page - 1) * limit }) },
				};
			},
		},
		{
			url: '/',
			method: 'POST',
			schema: BorrowerSchemas.Register,
			handler: async ({ body }) => {
				try {
					await borrowerService.register(body as any);
					return { status: true, data: { message: 'You Have Registered Successfully' } };
				} catch (error: any) {
					return {
						status: false,
						error: { type: 'CONFLICT', details: { message: 'Looks Like this email already in use' } },
					};
				}
			},
		},
		{
			url: '/login',
			method: 'POST',
			schema: BorrowerSchemas.Login,
			handler: async ({ body }) => {
				const { status, token } = await borrowerService.login(body as any);
				if (!status) {
					return {
						status: false,
						error: { type: 'UNAUTHENTICATED', details: { message: 'Invalid email or password' } },
					};
				}
				return { status: true, data: { token } };
			},
		},
		{
			url: '/change-email',
			method: 'PUT',
			schema: BorrowerSchemas.ChangeEmail,
			preHandler: [hooks.tokenRequired],
			handler: async ({ body, locals }) => {
				try {
					const { UID } = locals;
					const { newEmail, currentPassword } = body as any;
					const { status } = await borrowerService.changeEmail({ id: UID, newEmail, currentPassword });
					if (!status) {
						return {
							status: false,
							error: { type: 'INVALID_INPUT', details: { message: 'Something Went Wrong' } },
						};
					}
					return { status: true, data: { message: 'Email Updated Successfully' } };
				} catch (error: any) {
					return {
						status: false,
						error: { type: 'CONFLICT', details: { message: 'Looks Like this email already in use' } },
					};
				}
			},
		},
		{
			url: '/change-password',
			method: 'PUT',
			schema: BorrowerSchemas.ChangePassword,
			preHandler: [hooks.tokenRequired],
			handler: async ({ body, locals }) => {
				const { UID } = locals;
				const { newPassword, currentPassword } = body as any;
				const { status } = await borrowerService.changePassword({ id: UID, newPassword, currentPassword });
				if (!status) {
					return {
						status: false,
						error: { type: 'INVALID_INPUT', details: { message: 'Something Went Wrong' } },
					};
				}
				return { status: true, data: { message: 'Password Updated Successfully' } };
			},
		},
		{
			url: '/delete-account',
			method: 'DELETE',
			schema: BorrowerSchemas.DeleteAccount,
			preHandler: [hooks.tokenRequired],
			handler: async ({ body, locals }) => {
				const { UID } = locals;
				const { currentPassword } = body as any;
				const { status } = await borrowerService.deleteAccount({ id: UID, currentPassword });
				if (!status) {
					return {
						status: false,
						error: { type: 'INVALID_INPUT', details: { message: 'Something Went Wrong' } },
					};
				}
				return { status: true, data: { message: 'Account Deleted Successfully Successfully' } };
			},
		},
	];
}
