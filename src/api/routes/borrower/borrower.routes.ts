import { TLoginInput, TRegisterInput } from '../../../services';
import { BorrowerSchemas } from './borrower.validation';

type TChangeEmailBody = { newEmail: string; currentPassword: string };
type TChangePasswordBody = { newPassword: string; currentPassword: string };
type TDeleteAccountBody = { currentPassword: string };

export async function BorrowerApiBuilder({ services, hooks }: ApiBuilderInput): Promise<ApiBuilderOutput> {
	const { borrowerService } = services;
	return [
		{
			url: '/',
			method: 'GET',
			schema: BorrowerSchemas.GetAllBorrowers,
			preHandler: [hooks.tokenRequired, hooks.librariansOnly],
			handler: async ({ query }: HandlerParameter<{ query: PaginatedQuery }>) => {
				const { limit = -1, page = 1 } = query;
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
			handler: async ({ body }: HandlerParameter<{ body: TRegisterInput }>) => {
				try {
					await borrowerService.register(body);
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
			config: { rateLimit: { limit: 5, interval: 60 } },
			handler: async ({ body }: HandlerParameter<{ body: TLoginInput }>) => {
				const { status, token } = await borrowerService.login(body);
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
			handler: async ({ body, locals }: HandlerParameter<{ body: TChangeEmailBody }>) => {
				try {
					const { UID } = locals;
					const { status } = await borrowerService.changeEmail({ id: UID, ...body });
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
			handler: async ({ body, locals }: HandlerParameter<{ body: TChangePasswordBody }>) => {
				const { UID } = locals;
				const { status } = await borrowerService.changePassword({ id: UID, ...body });
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
			handler: async ({ body, locals }: HandlerParameter<{ body: TDeleteAccountBody }>) => {
				const { UID } = locals;
				const { status } = await borrowerService.deleteAccount({ id: UID, ...body });
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
