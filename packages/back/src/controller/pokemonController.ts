import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { doQuery } from '../util';
import {
	getDailyPokemon,
	getPokemon,
	getPokemonFromGeneration,
	getPokemonWithNameLengthList,
	getPokemonWithNameLengthListFromGeneration,
	getRandomPokemon,
	updatePokemon
} from '../service';

export default async function pokemonController(fastify: FastifyInstance) {
	fastify.get('/', async function (_request: FastifyRequest, reply: FastifyReply) {
		let { data: randomPokemon, error: randomPokemonError } = await getRandomPokemon(fastify);
		if (randomPokemonError || !randomPokemon) {
			reply.status(500).send(randomPokemonError || new Error('Could not get a random pokemon'));
			return;
		}

		if (!randomPokemon.types) {
			const { error: updateError } = await updatePokemon(fastify, randomPokemon);
			if (!updateError) {
				({ data: randomPokemon, error: randomPokemonError } = await getPokemon(
					fastify,
					randomPokemon.id
				));
				if (randomPokemonError || !randomPokemon) {
					reply.status(500).send(randomPokemonError || new Error('Could not get a random pokemon'));
					return;
				}
			}
		}

		const { data: pokemonWithNamesOfLength, error: pokemonWithNamesOfLengthError } =
			await getPokemonWithNameLengthList(fastify, randomPokemon.name.length);
		if (pokemonWithNamesOfLengthError || !pokemonWithNamesOfLength)
			return reply.send({
				error:
					pokemonWithNamesOfLengthError ||
					new Error('Could not get pokemon with name length: ' + randomPokemon.name.length)
			});

		return reply.send({
			validPokemon: randomPokemon,
			pokemon: pokemonWithNamesOfLength
		});
	});

	fastify.get('gen/:gen', async function (_request: FastifyRequest, reply: FastifyReply) {
		const generation: number = +(_request.params as { gen: string }).gen;
		let { data: pokemon, error: pokemonError } = await getPokemonFromGeneration(
			fastify,
			generation
		);
		console.info('Gen: ' + JSON.stringify(pokemon));
		if (pokemonError || !pokemon) {
			reply.status(500).send(pokemonError || new Error('Could not get generation'));
			return;
		}

		if (!pokemon.types) {
			const { error: updateError } = await updatePokemon(fastify, pokemon);
			if (!updateError) {
				({ data: pokemon, error: pokemonError } = await getPokemon(fastify, pokemon.id));
				if (pokemonError || !pokemon) {
					reply.status(500).send(pokemonError || new Error('Could not get a random pokemon'));
					return;
				}
			}
		}

		const { data: pokemonWithNamesOfLength, error: pokemonWithNamesOfLengthError } =
			await getPokemonWithNameLengthListFromGeneration(fastify, pokemon.name.length, generation);
		if (pokemonWithNamesOfLengthError || !pokemonWithNamesOfLength)
			return reply.send({
				error:
					pokemonWithNamesOfLengthError ||
					new Error('Could not get pokemon with name length: ' + pokemon.name.length)
			});

		return reply.send({
			validPokemon: pokemon,
			pokemon: pokemonWithNamesOfLength
		});
	});

	fastify.get('/daily', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { data: daily, error } = await getDailyPokemon(fastify);
		if (error || !daily)
			return reply.send({ error: error || new Error('Could not get daily pokemon') });

		const { data: pokemonWithNamesOfLength, error: pokemonWithNamesOfLengthError } =
			await getPokemonWithNameLengthList(fastify, daily.name.length);
		if (pokemonWithNamesOfLengthError || !pokemonWithNamesOfLength)
			return reply.send({
				error:
					pokemonWithNamesOfLengthError ||
					new Error('Could not get pokemon with name length: ' + daily.name.length)
			});

		return reply.send({
			validPokemon: daily,
			pokemon: pokemonWithNamesOfLength
		});
	});

	fastify.post('/daily/reset/:key', async function (_request: FastifyRequest, reply: FastifyReply) {
		const key = (_request.params as { key: string }).key;
		if (key !== process.env.DAILY_RESET_KEY) return reply.status(403).send('Unauthorized');

		try {
			const { data: randomPokemon, error: randomPokemonError } = await getRandomPokemon(fastify);
			if (randomPokemonError || !randomPokemon) {
				reply.status(500).send(randomPokemonError || new Error('Could not get a random pokemon'));
				return;
			}

			await doQuery(fastify, `INSERT IGNORE INTO daily (name, day) VALUES (?, CURRENT_DATE())`, [
				randomPokemon.name
			]);

			await updatePokemon(fastify, randomPokemon);

			return reply.send();
		} catch (e) {
			return reply.status(500).send(e);
		}
	});
}
