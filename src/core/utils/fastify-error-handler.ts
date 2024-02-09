import fastify, { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { GenerateResponse, loggers } from '.';

export const errorHandler = (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
	const { validation } = error;
	console.log("󱓞 ~ errorHandler ~ error:", error)
	loggers.exceptions.error({
		error: {
			code: error.code,
			message: error.message,
			name: error.name,
			stack: error.stack,
			statusCode: error.statusCode,
			validation: error.validation,
			validationContext: error.validationContext,
		},
		'request-id': request.id,
	});
	if (error instanceof fastify.errorCodes.FST_ERR_BAD_URL) {
		const { code, body } = GenerateResponse({
			responseInput: {
				status: false,
				error: { type: 'INVALID_INPUT', details: { message: 'URL Is Invalid' } },
			},
		});
		return reply.status(code).send(body);
	}
	const { code, body } = GenerateResponse({
		responseInput: {
			status: false,
			error: { type: validation ? 'INVALID_INPUT' : 'INTERNAL_SERVER_ERROR', details: validation },
		},
	});
	reply.status(code).send(body);
};
