import { HookBuilderInput } from '../../core/utils/routes-manager';
import { AdminsOnlyBuilder } from './admins-only.hook';
import { TokenRequiredBuilder } from './token-required.hook';

export async function GetHooks(input: HookBuilderInput) {
	return {
		tokenRequired: await TokenRequiredBuilder(input),
		adminsOnly:await AdminsOnlyBuilder(input)
	};
}

