export function stripSlashes(input: string): string {
	return input.replace(/^\/+|\/+$/g, '');
}
