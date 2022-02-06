import { FastifyInstance } from 'fastify';
import pokemonController from './controller/pokemonController';

export default async function router(fastify: FastifyInstance) {
	fastify.register(pokemonController, { prefix: '/' });
}
