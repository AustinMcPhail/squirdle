import { API_URL } from './config';

export const getRandomPokemon = async (fetch) => {
	const response = await fetch(`${API_URL}`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(response.text())
			}
		};

	return { data: await response.json() };
};

export const getGenerationPokemon = async (generation, fetch) => {
	const response = await fetch(`${API_URL}/gen/${generation}`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(response.text())
			}
		};

	return { data: await response.json() };
};

export const getDailyChallenge = async (fetch) => {
	const response = await fetch(`${API_URL}/daily`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(response.text())
			}
		};

	return { data: await response.json() };
};
