import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { getAllPokemon } from '../service';

export default async function pokemonController(fastify: FastifyInstance) {
	fastify.get('/', async function (_request: FastifyRequest, reply: FastifyReply) {
		reply.send([]);
	});
	fastify.get('/daily', async function (_request: FastifyRequest, reply: FastifyReply) {
		reply.send([]);
	});

	fastify.post('/seed', async function (_request: FastifyRequest, reply: FastifyReply) {
		const { data: pokemon, error } = await getAllPokemon();
		if (error) reply.status(error.status).send(error.error);
		else reply.send(pokemon);
	});
}
