import { FastifyInstance } from 'fastify';
import { getPokemonDetails } from '.';
import { Pokemon } from '../domain';
import { doQuery, getMany, getOne } from '../util';

export const getPokemonList = async (
	fastify: FastifyInstance,
	generation?: number
): Promise<{ data: string[]; error?: Error }> => {
	let query = `SELECT name FROM pokemon`;
	if (generation && !isNaN(generation)) query = `${query} WHERE generation = ?`;
	const { data, error } = await getMany<Pokemon>(fastify, query, [generation]);
	if (error || !data) return { data: [], error: error || new Error('Could not get pokemon list') };
	return { data: data.map((pokemon) => pokemon.name), error };
};

export const getPokemonWithNameLengthList = async (
	fastify: FastifyInstance,
	length: number
): Promise<{ data: string[]; error?: Error }> => {
	const { data, error } = await getMany<Pokemon>(
		fastify,
		`SELECT name FROM pokemon WHERE CHAR_LENGTH(name) <= ?`,
		[length]
	);
	if (error || !data) return { data: [], error: error || new Error('Could not get pokemon list') };
	return { data: data.map((pokemon) => pokemon.name), error };
};

export const getPokemonWithNameLengthListFromGeneration = async (
	fastify: FastifyInstance,
	length: number,
	generation: number
): Promise<{ data: string[]; error?: Error }> => {
	const { data, error } = await getMany<Pokemon>(
		fastify,
		`SELECT name FROM pokemon WHERE CHAR_LENGTH(name) <= ? AND generation = ?`,
		[length, generation]
	);
	if (error || !data) return { data: [], error: error || new Error('Could not get pokemon list') };
	return { data: data.map((pokemon) => pokemon.name), error };
};

export const getDailyPokemon = async (
	fastify: FastifyInstance
): Promise<{ data?: Pokemon; error?: Error }> => {
	const { data: daily, error } = await getOne<{ name: string }>(
		fastify,
		`SELECT name FROM daily ORDER BY id DESC LIMIT 1`,
		[]
	);
	if (error || !daily) return { error: error || new Error('Could not get daily pokemon') };

	const { data: pokemon, error: pokemonError } = await getOne<Pokemon>(
		fastify,
		`SELECT id, name, generation, url, image, cry, types FROM pokemon WHERE name = ?`,
		[daily.name]
	);
	if (pokemonError || !pokemon) {
		return { error: error || new Error('Could not get daily pokemon') };
	}
	return { data: pokemon };
};

export const getRandomPokemon = async (
	fastify: FastifyInstance
): Promise<{ data?: Pokemon; error?: Error }> => {
	const { data: randomPokemon, error } = await getOne<Pokemon>(
		fastify,
		`SELECT id, name, generation, url, image, cry, types FROM pokemon order by rand() limit 1`,
		[]
	);
	if (error || !randomPokemon) {
		return { error: error || new Error('Could not get a random pokemon') };
	}
	return { data: randomPokemon };
};

export const getPokemon = async (
	fastify: FastifyInstance,
	id: number
): Promise<{ data?: Pokemon; error?: Error }> => {
	const { data: randomPokemon, error } = await getOne<Pokemon>(
		fastify,
		`SELECT id, name, generation, url, image, cry, types FROM pokemon where id = ?`,
		[id]
	);
	if (error || !randomPokemon) {
		return { error: error || new Error('Could not get pokemon ' + id) };
	}
	return { data: randomPokemon };
};

export const getPokemonFromGeneration = async (
	fastify: FastifyInstance,
	generation: number
): Promise<{ data?: Pokemon; error?: Error }> => {
	const { data: randomPokemon, error } = await getOne<Pokemon>(
		fastify,
		`SELECT id, name, generation, url, image, cry, types FROM pokemon where generation = ?`,
		[generation]
	);
	if (error || !randomPokemon) {
		return { error: error || new Error('Could not get generation ' + generation) };
	}
	return { data: randomPokemon };
};

export const updatePokemon = async (
	fastify: FastifyInstance,
	pokemon: { name: string; url: string }
): Promise<{ error?: Error }> => {
	const { data: details, error: detailsError } = await getPokemonDetails(pokemon.url);
	if (detailsError || !details) {
		return { error: detailsError?.error || new Error('Could not get pokemon details') };
	}
	const { error: updateError } = await doQuery(
		fastify,
		`UPDATE pokemon SET types = ? WHERE name = ?`,
		[`["${details.types.join('","')}"]`, pokemon.name]
	);
	if (updateError) {
		return { error: updateError };
	}
	return {};
};
