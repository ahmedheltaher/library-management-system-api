import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse } from '../../core/utils';
import { JWTService } from '../../utils';

const typeLookup: Record<string, string> = {
	'0xFF': 'BORROWER',
	'0x00': 'LIBRARIAN',
};

export async function TokenRequiredBuilder({ configurations, services }: HookBuilderInput) {
	return async (request: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
		const token = request.headers.authentication;
		const { code, body } = GenerateResponse({
			responseInput: { status: false, error: { type: 'UNAUTHENTICATED' } },
		});

		if (!token || typeof token !== 'string') {
			return reply.code(code).send(body);
		}

		try {
			const payload = JWTService.decodeToken(token, configurations.jwt.secret);
			const { t, UID } = payload as any;
			const type = typeLookup[t];
			if (!type) return reply.code(code).send(body);
			if (type === 'BORROWER') {
				const borrower = await services.borrowerService.getById(UID);
				if (!borrower) return reply.code(code).send(body);
			}

			reply.locals = { ...reply.locals, ...payload, type };
		} catch (error) {
			return reply.code(code).send(body);
		}
	};
}
