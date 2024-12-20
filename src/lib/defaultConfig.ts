import { PUBLIC_OLLAMA_API } from '$env/static/public';

export default {
	ollamaApi: {
		value: PUBLIC_OLLAMA_API,
		type: 'string'
	},
	speed: {
		value: 1,
		type: 'float'
	},
	voice: {
		value: undefined,
		type: 'int'
	}
} as {
	[key: string]: {
		value: string | number | undefined;
		type: string;
	};
};
