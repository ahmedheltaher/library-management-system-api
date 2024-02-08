import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse } from '../../core/utils';
import { HookBuilderInput } from '../../core/utils/routes-manager';
import { AvailableServices } from '../../services';
import { JWTService } from '../../utils';

export async function TokenRequiredBuilder({ configurations, services }: HookBuilderInput<AvailableServices>) {
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
			reply.locals.payload = payload;
		} catch (error) {
			return reply.code(code).send(body);
		}
	};
}
