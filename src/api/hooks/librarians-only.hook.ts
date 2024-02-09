import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse } from '../../core/utils';


export async function LibrariansOnlyBuilder({ configurations, services }: HookBuilderInput) {
	return async (_: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
		const { code, body } = GenerateResponse({ responseInput: { status: false, error: { type: 'UNAUTHORIZED' } } });
		try {
			const { UID } = reply.locals as any;
			const librarian = await services.librarianService.getById(UID);
			if (!librarian) return reply.code(code).send(body);
		} catch (error) {
			return reply.code(code).send(body);
		}
	};
}
