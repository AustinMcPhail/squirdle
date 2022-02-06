import app from './app';

import { MySQLPromisePool } from 'fastify-mysql';
declare module 'fastify' {
	interface FastifyInstance {
		mysql: MySQLPromisePool;
	}
}

const FASTIFY_PORT = Number(process.env.FASTIFY_PORT) || 3001;

app.listen(FASTIFY_PORT);

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
console.log(`Route index: /`);
