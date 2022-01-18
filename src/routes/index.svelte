<script>
	import '../global.css';

	let selectedPokemonGeneration = 1;
	let pokemon = [];

	$: nameLengthMode = getMode(pokemon.map((pokemon) => pokemon.name.length)) | 0;
	$: pokemonWithNamesOfModeLength = pokemon.filter(
		(pokemon) => pokemon.name.length === nameLengthMode
	);

	$: randomPokemon = getRandomPokemon(pokemonWithNamesOfModeLength);
	const getRandomPokemon = (pokemon) => {
		return pokemon[Math.floor(Math.random() * pokemon.length)];
	};

	const selectPokemonGeneration = async () => {
		const response = await fetch(
			`https://pokeapi.co/api/v2/generation/${selectedPokemonGeneration}/`
		);
		const data = await response.json();
		pokemon = data.pokemon_species;
	};

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

	const turns = 6;
	let currentTurn = 1;
	$: turnInputs = [];
	$: turnResults = [];

	const getTurnResults = (input) => {
		return input.map((char, i) => {
			// Correct character and correct position
			if (randomPokemon.name[i] === char) {
				return 3;
			}

			// VOLTORB
			// VOOOXXX

			// Correct character but wrong position
			if (randomPokemon.name.includes(char)) {
				//TODO: Needs to account for matched and unmatched duplicates

				// Count duplicates
				let duplicates = randomPokemon.name.match(new RegExp(char, 'g')).length;
				let duplicatesInInput = input.filter((c) => char === c).length;

				if (duplicatesInInput === 1 && duplicates === 1) return 2;

				// Count matches ahead of index
				let charPositions = randomPokemon.name
					.split('')
					.slice(i + 1, randomPokemon.name.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				let inputPositions = input
					.slice(i + 1, input.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				const matchedAhead = inputPositions.filter((i) => charPositions.includes(i)).length;

				// Count matches behind index
				charPositions = randomPokemon.name
					.split('')
					.slice(0, i)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				inputPositions = input
					.slice(0, i)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				let unmatchedBehind = 0;
				const matchedBehind = inputPositions.filter((i) => {
					const res = charPositions.includes(i);
					if (!res) unmatchedBehind += 1;
					return res;
				}).length;

				const totalAccountedFor = matchedAhead + matchedBehind + unmatchedBehind;

				if (totalAccountedFor < duplicates) {
					return 2;
				} else {
					return 1;
				}
			}

			// Incorrect character
			return 1;
		});
	};

	let input = '';
	let win = false;
	let lose = false;
	const handleTurnInput = () => {
		if (input.length < randomPokemon.name.length) return;

		const turn = input.split('');
		turnInputs = [...turnInputs, turn];
		turnResults = [...turnResults, getTurnResults(turn)];
		currentTurn += 1;

		win = input === randomPokemon.name;
		lose = currentTurn > turns;
		input = '';
	};

	const restartGame = () => {
		input = '';
		win = false;
		lose = false;
		turnInputs = [];
		turnResults = [];
		randomPokemon = getRandomPokemon(pokemonWithNamesOfModeLength);
		currentTurn = 1;
	};
</script>

<form on:submit|preventDefault={selectPokemonGeneration}>
	<select name="generation" id="generation" bind:value={selectedPokemonGeneration}>
		<option value="1" selected>Generation 1</option>
		<option value="2">Generation 2</option>
		<option value="3">Generation 3</option>
		<option value="4">Generation 4</option>
		<option value="5">Generation 5</option>
		<option value="6">Generation 6</option>
		<option value="7">Generation 7</option>
	</select>
	<button type="submit">Submit</button>
</form>

{#if randomPokemon}
	{randomPokemon.name}
	<main>
		{#each turnInputs as input, turn}
			<p class="inputs">
				{#each input as character, position}
					<span data-status={turnResults[turn][position]}>
						{character}
					</span>
				{/each}
			</p>
		{/each}
		<form on:submit|preventDefault={handleTurnInput}>
			<input type="text" maxlength={nameLengthMode} bind:value={input} />
		</form>
		<p>
			{input.length} / {randomPokemon.name.length}
		</p>

		{#if win}
			<p>You Win!</p>
			<button on:click={restartGame}>Restart</button>
		{/if}

		{#if lose}
			<p>You Lose!</p>
			<p>{randomPokemon.name}</p>
			<button on:click={restartGame}>Restart</button>
		{/if}
	</main>
{/if}

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.inputs span[data-status='1'] {
		color: white;
	}
	.inputs span[data-status='2'] {
		color: blue;
	}
	.inputs span[data-status='3'] {
		color: green;
	}
</style>
