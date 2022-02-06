import fastify from 'fastify';
import router from './router';

const server = fastify({
	// Logger only for production
	logger: !!(process.env.NODE_ENV !== 'dev')
});

// Middleware: Router
server.register(router);

export default server;
