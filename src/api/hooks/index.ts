import { HookBuilderInput } from '../../core/utils/routes-manager';
import { AvailableServices } from '../../services';
import { TokenRequiredBuilder } from './token-required.hook';

export async function GetHooks(input: HookBuilderInput<AvailableServices>) {
	return {
		tokenRequired: await TokenRequiredBuilder(input),
	};
}

export type AvailableHooks = Awaited<ReturnType<typeof GetHooks>>;
