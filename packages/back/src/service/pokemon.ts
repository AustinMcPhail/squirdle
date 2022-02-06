const importDynamic = new Function('modulePath', 'return import(modulePath)');

const fetch = async (...args: any[]) => {
	const module = await importDynamic('node-fetch');
	return module.default(...args);
};

type Err<T, E> = {
	data?: T;
	error: E;
};
type Ok<T, E> = {
	data: T;
	error?: E;
};
type Response<
	T,
	E = {
		status: number;
		error: Error;
	}
> = Err<null, E> | Ok<T, null>;

export const getAllGenerationNumerals = async (): Promise<Response<string[]>> => {
	const response = await fetch(`https://pokeapi.co/api/v2/generation`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(`https://pokeapi.co/api/v2/generation`)
			}
		};
	const data = (await response.json()) as { results: { name: string }[] };
	const numerals = data.results.map((g) => g.name.split('-')[1]);

	return {
		data: numerals
	};
};

export const getAllPokemon = async (): Promise<Response<{ name: string; url: string }[]>> => {
	const { data: generations, error } = await getAllGenerationNumerals();
	if (error) return { error };
	if (!generations) throw new Error('Could not get generations');

	let pokemon: any[] = [];
	for (const gen of generations) {
		const { data: generation, error } = await getGeneration(`generation-${gen}`);
		if (error) return { error };
		if (!generation) continue;

		pokemon = [...pokemon, ...generation.pokemon_species];
	}

	return {
		data: pokemon
	};
};

export const getGeneration = async (
	gen: string
): Promise<Response<{ pokemon_species: { name: string }[] }>> => {
	const response = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(`https://pokeapi.co/api/v2/generation/${gen}/`)
			}
		};
	const generation = (await response.json()) as { pokemon_species: { name: string }[] };
	return {
		data: generation
	};
};
