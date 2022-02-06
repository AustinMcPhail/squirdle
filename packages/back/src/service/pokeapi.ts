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
> = Err<undefined, E> | Ok<T, undefined>;

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

export type PokemonRespone = {
	id: number;
	name: string;
	generation: number;
	url: string;
	image: string;
	cry: string;
};
export const getAllPokemon = async (): Promise<Response<PokemonRespone[]>> => {
	const { data: generations, error } = await getAllGenerationNumerals();
	if (error) return { error };
	if (!generations) throw new Error('Could not get generations');

	let pokemon: PokemonRespone[] = [];
	for (const [index, _] of generations.entries()) {
		const { data: generation, error } = await getGeneration(index + 1);
		if (error) return { error };
		if (!generation) continue;
		pokemon = [...pokemon, ...generation];
	}

	return {
		data: pokemon
	};
};

export const getGeneration = async (generation: number): Promise<Response<PokemonRespone[]>> => {
	const response = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(`https://pokeapi.co/api/v2/generation/${generation}/`)
			}
		};

	let { pokemon_species } = (await response.json()) as { pokemon_species: PokemonRespone[] };
	pokemon_species = pokemon_species.map((mon) => {
		const suffix = mon.name.slice(-2);
		if (suffix === '-f' || suffix === '-m') mon.name = mon.name.slice(0, -2);

		const id = +mon.url.split('pokemon-species')[1].replace(/\//g, '');
		const name = mon.name.replace(/-/g, '');
		const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
		const url = mon.url.replace(/-species/g, '');
		const cry = `https://play.pokemonshowdown.com/audio/cries/${name}.mp3`;

		return {
			id,
			name,
			generation,
			image,
			url,
			cry
		};
	});
	return {
		data: pokemon_species
	};
};

type RawPokemonDetails = {
	sprites: { other: { ['official-artwork']: { front_default: string } } };
	types: { type: { name: string } }[];
};
type PokemonDetails = {
	sprite: string;
	types: string[];
};
export const getPokemonDetails = async (url: string): Promise<Response<PokemonDetails>> => {
	const response = await fetch(url);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(url)
			}
		};
	const pokemon = (await response.json()) as RawPokemonDetails;

	const sprite = pokemon.sprites.other['official-artwork'].front_default;
	const types = pokemon.types.map(({ type }) => type.name);

	return {
		data: { sprite, types }
	};
};

/*
"types": [
        {
            "slot": 1,
            "type": {
                "name": "grass",
                "url": "https://pokeapi.co/api/v2/type/12/"
            }
        },
        {
            "slot": 2,
            "type": {
                "name": "poison",
                "url": "https://pokeapi.co/api/v2/type/4/"
            }
        }
    ],
*/
