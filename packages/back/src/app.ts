import fastify from 'fastify';
import fastifyMySql from 'fastify-mysql';
import router from './router';

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
server.register(router);

export default server;
