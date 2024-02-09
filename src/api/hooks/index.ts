import { LibrariansOnlyBuilder } from './librarians-only.hook';
import { TokenRequiredBuilder } from './token-required.hook';

export async function GetHooks(input: HookBuilderInput) {
	return {
		tokenRequired: await TokenRequiredBuilder(input),
		librariansOnly: await LibrariansOnlyBuilder(input),
	};
}
