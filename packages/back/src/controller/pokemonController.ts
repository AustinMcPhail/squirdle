import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { doQuery } from '../util';
import {
	getAllPokemon,
	getDailyPokemon,
	getPokemon,
	getPokemonWithNameLengthList,
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
				error: pokemonWithNamesOfLengthError || new Error('Could not get pokemon with name length')
			});

		return reply.send({
			validPokemon: randomPokemon,
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
				error: pokemonWithNamesOfLengthError || new Error('Could not get pokemon with name length')
			});

		return reply.send({
			validPokemon: daily,
			pokemon: pokemonWithNamesOfLength
		});
	});

	fastify.post('/daily/reset', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { error } = await doQuery(
			fastify,
			`CREATE TABLE IF NOT EXISTS daily (id INT NOT NULL AUTO_INCREMENT, name varchar(255) not null, day Date, PRIMARY KEY (id), FOREIGN KEY (name) REFERENCES pokemon(name))`
		);
		if (error) {
			reply.status(500).send(error);
			return;
		}

		try {
			const { data: randomPokemon, error: randomPokemonError } = await getRandomPokemon(fastify);
			if (randomPokemonError || !randomPokemon) {
				reply.status(500).send(randomPokemonError || new Error('Could not get a random pokemon'));
				return;
			}

			await doQuery(fastify, `INSERT INTO daily (name, day) VALUES (?, CURRENT_DATE())`, [
				randomPokemon.name
			]);

			await updatePokemon(fastify, randomPokemon);

			reply.send();
		} catch (e) {
			reply.status(500).send(e);
		}
	});

	fastify.post('/seed', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { data: pokemon, error: err } = await getAllPokemon();
		if (err) {
			reply.status(err.status).send(err.error);
			return;
		}
		if (!pokemon || pokemon.length === 0) {
			reply.status(500).send(new Error('Could not get pokemon'));
			return;
		}

		let { error } = await doQuery(fastify, 'DROP TABLE IF EXISTS daily');
		if (error) {
			reply.status(500).send(error);
			return;
		}
		({ error } = await doQuery(fastify, 'DROP TABLE IF EXISTS pokemon'));
		if (error) {
			reply.status(500).send(error);
			return;
		}
		({ error } = await doQuery(
			fastify,
			`CREATE TABLE IF NOT EXISTS pokemon (id int not null, name varchar(255) unique not null, generation int not null, url varchar(255) not null, image varchar(255) not null, cry varchar(255) not null, types JSON, used int default 0, lastUsed Date, PRIMARY KEY (id))`
		));
		if (error) {
			reply.status(500).send(error);
			return;
		}

		for (const mon of pokemon) {
			try {
				await doQuery(
					fastify,
					`INSERT IGNORE INTO pokemon (id, name, generation, url, image, cry) VALUES (?, ?, ?, ?, ?, ?)`,
					[mon.id, mon.name, mon.generation, mon.url, mon.image, mon.cry]
				);
			} catch (e) {
				reply.status(500).send(e);
				return;
			}
		}
		reply.send();
	});
}
