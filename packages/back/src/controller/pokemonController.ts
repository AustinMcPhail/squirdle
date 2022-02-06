import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { DateTime } from 'luxon';
import { Pokemon } from '../domain';
import {
	doQuery,
	getAllPokemon,
	getOne,
	getPokemonList,
	getPokemonWithNameLengthList
} from '../service';

export default async function pokemonController(fastify: FastifyInstance) {
	fastify.get('/', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { data, error } = await getPokemonList(fastify);

		return reply.send(data);
	});

	fastify.get('/daily', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { data: daily, error } = await getOne<{ name: string }>(
			fastify,
			`SELECT name FROM daily ORDER BY id DESC LIMIT 1`,
			[]
		);
		if (error || !daily) {
			reply.status(500).send(error || new Error('Could not get daily pokemon'));
			return;
		}

		const { data: pokemon, error: pokemonError } = await getOne<Pokemon>(
			fastify,
			`SELECT id, name, generation, url, image, cry FROM pokemon WHERE name = ?`,
			[daily.name]
		);
		if (pokemonError || !pokemon) {
			reply.status(500).send(pokemonError || new Error('Could not get pokemon'));
			return;
		}

		reply.send({
			validPokemon: pokemon,
			pokemon: await getPokemonWithNameLengthList(fastify, pokemon.name.length)
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
			const { data: randomPokemon, error } = await getOne<Pokemon>(
				fastify,
				`SELECT * FROM pokemon WHERE name NOT IN (SELECT name FROM daily) order by rand() limit 1`,
				[]
			);
			if (error || !randomPokemon) {
				reply.status(500).send(error || new Error('Could not get random pokemon'));
				return;
			}
			await doQuery(fastify, `INSERT INTO daily (name, day) VALUES (?, CURRENT_DATE())`, [
				randomPokemon.name
			]);
			reply.send();
		} catch (e) {
			reply.status(500).send(e);
		}
	});

	// fastify.post('/seed', async function (_request: FastifyRequest, reply: FastifyReply) {
	// 	const { data: pokemon, error: err } = await getAllPokemon();
	// 	if (err) {
	// 		reply.status(err.status).send(err.error);
	// 		return;
	// 	}
	// 	if (!pokemon || pokemon.length === 0) {
	// 		reply.status(500).send(new Error('Could not get pokemon'));
	// 		return;
	// 	}

	// 	let { error } = await doQuery(fastify, 'DROP TABLE IF EXISTS daily');
	// 	if (error) {
	// 		reply.status(500).send(error);
	// 		return;
	// 	}
	// 	({ error } = await doQuery(fastify, 'DROP TABLE IF EXISTS pokemon'));
	// 	if (error) {
	// 		reply.status(500).send(error);
	// 		return;
	// 	}
	// 	({ error } = await doQuery(
	// 		fastify,
	// 		`CREATE TABLE IF NOT EXISTS pokemon (id int not null, name varchar(255) unique not null, generation int not null, url varchar(255) not null, image varchar(255) not null, cry varchar(255) not null, used int default 0, lastUsed Date, PRIMARY KEY (id))`
	// 	));
	// 	if (error) {
	// 		reply.status(500).send(error);
	// 		return;
	// 	}

	// 	for (const mon of pokemon) {
	// 		try {
	// 			await doQuery(
	// 				fastify,
	// 				`INSERT IGNORE INTO pokemon (id, name, generation, url, image, cry) VALUES (?, ?, ?, ?, ?, ?)`,
	// 				[mon.id, mon.name, mon.generation, mon.url, mon.image, mon.cry]
	// 			);
	// 		} catch (e) {
	// 			reply.status(500).send(e);
	// 			return;
	// 		}
	// 	}
	// 	reply.send();
	// });
}
