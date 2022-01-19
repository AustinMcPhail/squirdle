const getMode = (arr) => {
	let modeMap = {};
	let maxEl = arr[0],
		maxCount = 1;
	for (let i = 0; i < arr.length; i++) {
		let el = arr[i];
		if (modeMap[el] == null) modeMap[el] = 1;
		else modeMap[el]++;
		if (modeMap[el] > maxCount) {
			maxEl = el;
			maxCount = modeMap[el];
		}
	}
	return maxEl;
};

export const getAllGenerationNumerals = async (fetch) => {
	const response = await fetch(`https://pokeapi.co/api/v2/generation`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(`https://pokeapi.co/api/v2/generation`)
			}
		};

	const data = await response.json();
	const numerals = data.results.map((g) => g.name.split('-')[1]);

	return {
		generations: numerals
	};
};

export const getAllPokemon = async (fetch) => {
	const { generations, error } = await getAllGenerationNumerals(fetch);
	if (error) return error;

	let pokemon = [];
	for (const gen of generations) {
		const { generation, error } = await getGeneration(`generation-${gen}`, fetch);
		if (error) return error;
		pokemon = [...pokemon, ...generation.pokemon_species];
	}

	const words = toWordList(pokemon, 'name');
	return {
		data: words
	};
};

export const getGeneration = async (gen, fetch) => {
	const response = await fetch(`https://pokeapi.co/api/v2/generation/${gen}/`);
	if (!response.ok)
		return {
			error: {
				status: response.status,
				error: new Error(`https://pokeapi.co/api/v2/generation/${gen}/`)
			}
		};
	const generation = await response.json();
	return {
		generation
	};
};

export const toWordList = (items, attr) => {
	const nameLengthMode = getMode(items.map((word) => word[attr]?.length || 0).filter(Boolean));
	return (
		items.filter((item) => item[attr]?.length === nameLengthMode).map((item) => item[attr]) || []
	);
};
