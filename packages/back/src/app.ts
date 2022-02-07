import fastify from 'fastify';
import fastifyMySql from 'fastify-mysql';
import router from './router';
import { getRandomPokemon, seedDB, updatePokemon } from './service';
import { doQuery } from './util';

const server = fastify({
	// Logger only for production
	logger: !!(process.env.NODE_ENV !== 'dev')
});

// Middleware: Router
server.register(fastifyMySql, {
	promise: true,
	connectionString: `mysql://${process.env.DBUSER || 'root'}:${
		process.env.DBPASS || 'password'
	}@localhost/squirdle`
});
server.register(async (fastify, _, next) => {
	// check if db exists and contains pokemon table
	let result = (
		await fastify.mysql.query(
			`SELECT table_rows FROM information_schema.tables WHERE table_schema = 'squirdle' AND table_name = 'pokemon'`
		)
	)[0] as { table_rows: number }[];
	if (!result || result.length === 0 || result[0].table_rows <= 0) {
		// seed db
		const { error } = await seedDB(fastify);
		if (error) throw new Error('Failed to seed database');
	}

	// add daily table
	result = (
		await fastify.mysql.query(
			`SELECT table_rows FROM information_schema.tables WHERE table_schema = 'squirdle' AND table_name = 'daily'`
		)
	)[0] as { table_rows: number }[];
	if (!result || result.length === 0 || result[0].table_rows <= 0) {
		const { error } = await doQuery(
			fastify,
			`CREATE TABLE IF NOT EXISTS daily (id INT NOT NULL AUTO_INCREMENT, name varchar(255) NOT NULL, day Date UNIQUE, PRIMARY KEY (id), FOREIGN KEY (name) REFERENCES pokemon(name))`
		);
		if (error) throw error;

		const { data: randomPokemon, error: randomPokemonError } = await getRandomPokemon(fastify);
		if (randomPokemonError || !randomPokemon) {
			throw randomPokemonError || new Error('Could not get a random pokemon');
		}
		await doQuery(fastify, `INSERT IGNORE INTO daily (name, day) VALUES (?, CURRENT_DATE())`, [
			randomPokemon.name
		]);
		await updatePokemon(fastify, randomPokemon);
	}
	next();
});
server.register(router);

export default server;
