export type Pokemon = {
	id: number;
	name: string;
	generation: number;
	url: string;
	image: string;
	cry: string;
	used?: number;
	lastUsed?: Date;
};
