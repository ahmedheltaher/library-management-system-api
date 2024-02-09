export const ERROR_RESPONSE_MESSAGES = [
	'INTERNAL_SERVER_ERROR',
	'UNAUTHENTICATED',
	'INVALID_INPUT',
	'ENTITY_NOT_FOUND',
	'CONFLICT',
	'UNAUTHORIZED',
] as const;

export type ErrorResponseMessages = (typeof ERROR_RESPONSE_MESSAGES)[number];

export type HandlerResult =
	| {
			status: true;
			data: Record<string, any>;
			headers?: Record<string, any>;
	  }
	| {
			status: false;
			error: {
				type: ErrorResponseMessages;
				details?: Record<string, any>;
				statusCode?: number;
			};
			headers?: Record<string, any>;
	  };

export type ResponseDetails = {
	message: string;
	statusCode: number;
};

export const errorMessages: Record<ErrorResponseMessages, ResponseDetails> = {
	INTERNAL_SERVER_ERROR: {
		message: 'Internal Server Error',
		statusCode: 500,
	},
	UNAUTHENTICATED: {
		message: 'You are not Authenticated',
		statusCode: 401,
	},
	INVALID_INPUT: {
		message: 'The Request Contains Invalid Data',
		statusCode: 400,
	},
	ENTITY_NOT_FOUND: {
		message: 'The Entity You Are Looking for is Not Found',
		statusCode: 404,
	},
	CONFLICT: {
		message: 'Conflict Happened while Processing the Request',
		statusCode: 409,
	},
	UNAUTHORIZED: {
		message: 'You are not Unauthorized to do this Action',
		statusCode: 403,
	},
};

export type GenerateResponseInput = {
	responseInput: HandlerResult;
};

export type GenerateResponseResult = {
	code: number;
	body: Record<string, any>;
	headers: Record<string, any>;
};

export function GenerateResponse({ responseInput }: GenerateResponseInput): GenerateResponseResult {
	const { status, headers = {} } = responseInput;

	if (status) {
		return { code: 200, body: { status, data: responseInput.data }, headers };
	}

	const { error } = responseInput;
	const { message, statusCode } = errorMessages[error.type];

	return {
		code: error.statusCode ? error.statusCode : statusCode,
		body: { status, error: { message, details: error.details || {} } },
		headers,
	};
}
