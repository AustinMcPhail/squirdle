export * from './pokemon';

import { FastifyInstance } from 'fastify';

export const getOne = async <T>(
	fastify: FastifyInstance,
	query: string,
	args: any[]
): Promise<{
	data?: T;
	error?: Error;
}> => {
	const connection = await fastify.mysql.getConnection();
	if (!connection) {
		return {
			error: new Error('Could not get db connection')
		};
	}
	try {
		const queryResult = (await connection.query(query, args))[0] as T[];
		connection.release();
		const data = queryResult[0];
		return {
			data
		};
	} catch (e) {
		return {
			error: e as Error
		};
	}
};

export const getMany = async <T>(
	fastify: FastifyInstance,
	query: string,
	args: any[]
): Promise<{
	data?: T[];
	error?: Error;
}> => {
	const connection = await fastify.mysql.getConnection();
	if (!connection) {
		return {
			error: new Error('Could not get db connection')
		};
	}
	try {
		const queryResult = (await connection.query(query, args))[0] as T[];
		connection.release();
		const data = queryResult;
		return {
			data
		};
	} catch (e) {
		return {
			error: e as Error
		};
	}
};

export const doQuery = async (
	fastify: FastifyInstance,
	query: string,
	args: any[] = []
): Promise<{
	error?: Error;
}> => {
	const connection = await fastify.mysql.getConnection();
	if (!connection) {
		return {
			error: new Error('Could not get db connection')
		};
	}
	try {
		await connection.query(query, args);
		connection.release();
		return { error: undefined };
	} catch (e) {
		return {
			error: e as Error
		};
	}
};
