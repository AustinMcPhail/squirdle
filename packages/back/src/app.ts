import fastify from 'fastify';
import fastifyMySql from 'fastify-mysql';
import router from './router';

// const db = mysql.createConnection({
// 	host: process.env.DB_HOST || 'localhost',
// 	user: process.env.DB_USER || 'root',
// 	password: process.env.DB_PASS || 'password'
// });
// db.connect();

// (() => {
// 	db.query('CREATE DATABASE IF NOT EXISTS squirdle');
// 	db.query('USE squirdle');

// 	db.query(
// 		`CREATE TABLE IF NOT EXISTS Pokemon (
// 		name varchar(255) unique not null,
// 		url varchar(255) not null,
// 		used int default 0,
// 		lastUsed Date,
// 		PRIMARY KEY (name)
// 	)`,
// 		(err, res) => {
// 			console.log({
// 				err,
// 				res
// 			});
// 		}
// 	);
// })();

const server = fastify({
	// Logger only for production
	logger: !!(process.env.NODE_ENV !== 'dev')
});

// Middleware: Router
server.register(fastifyMySql, {
	promise: true,
	connectionString: 'mysql://root:password@localhost/squirdle',
	password: process.env.DB_PASS || 'password'
});
server.register(router);

export default server;
