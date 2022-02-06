import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export default async function pokemonController(fastify: FastifyInstance) {
	fastify.get('/', async function (_request: FastifyRequest, reply: FastifyReply) {
		reply.send([]);
	});
	fastify.get('/daily', async function (_request: FastifyRequest, reply: FastifyReply) {
		reply.send([]);
	});
}
