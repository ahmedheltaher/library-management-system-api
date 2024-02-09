import { FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse } from '../../core/utils';
import { HookBuilderInput } from '../../core/utils/routes-manager';
import { JWTService } from '../../utils';

export async function AdminsOnlyBuilder({ configurations, services }: HookBuilderInput) {
	return async (request: FastifyRequest, reply: FastifyReply): Promise<unknown> => {
		const { UID } = reply.locals || {};
		const { code, body } = GenerateResponse({
			responseInput: { status: false, error: { type: 'UNAUTHORIZED' } },
		});

		try {
			// TODO: Check If this Is Admin Or Not
		} catch (error) {
			return reply.code(code).send(body);
		}
	};
}
