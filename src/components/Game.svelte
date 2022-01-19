<script>
	import Keyboard from './Keyboard.svelte';

	export let maxTurns = 6;

	export let words = [];
	let word = '';
	$: {
		word = getRandomWord(words);
	}

	$: nameLength = word.length;

	let currentTurn = 0;
	$: turnInputs = [];
	$: turnResults = [];

	const getRandomWord = (wordlist) => {
		return wordlist[Math.floor(Math.random() * wordlist.length)];
	};

	const getTurnResults = (input) => {
		return input.map((char, i) => {
			// Correct character and correct position
			if (word[i] === char) {
				return 3;
			}

			// Correct character but wrong position
			if (word.includes(char)) {
				//TODO: Needs to account for matched and unmatched duplicates

				// Count duplicates
				let duplicates = word.match(new RegExp(char, 'g')).length;
				let duplicatesInInput = input.filter((c) => char === c).length;

				if (duplicatesInInput === 1 && duplicates === 1) return 2;

				// Count matches ahead of index
				let charPositions = word
					.split('')
					.slice(i + 1, word.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				let inputPositions = input
					.slice(i + 1, input.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				const matchedAhead = inputPositions.filter((i) => charPositions.includes(i)).length;

				// Count matches behind index
				charPositions = word
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
		if (input.length < word.length) return;

		const turn = input.split('');
		turnInputs = [...turnInputs, turn];
		turnResults = [...turnResults, getTurnResults(turn)];
		currentTurn += 1;

		win = input === word;
		lose = currentTurn === maxTurns;
		input = '';
	};

	const restartGame = () => {
		input = '';
		win = false;
		lose = false;
		turnInputs = [];
		turnResults = [];
		word = getRandomWord(words);
		currentTurn = 0;
	};

	let active = false;
	function handleDisplayClick() {
		if (win || lose) return;

		document.getElementById('input').focus();
		active = true;
	}

	function handleUnfocus() {
		active = false;
	}

	function handleKeyboardInput({ detail: { key } }) {
		if (input.length < word.length) {
			input += key;
		}
	}
	function handleKeyboardBack() {
		input = input.length ? input.slice(0, input.length - 1) : '';
	}
	function handleKeyboardEnter() {
		handleTurnInput();
	}
</script>

<div>
	<div class="display-wrapper">
		<div
			class="display"
			class:active
			style="--wordLength: {nameLength}; --maxTurns: {maxTurns}"
			on:click={handleDisplayClick}
			on:focus={handleDisplayClick}
		>
			{#each Array.from({ length: maxTurns }) as _, turn}
				{#each Array.from({ length: nameLength }) as _, position}
					<div
						data-status={turnResults[turn] ? turnResults[turn][position] : ''}
						class:cursor={input.length === position && currentTurn === turn}
					>
						{#if currentTurn === turn}
							{input.charAt(position) || ''}
						{:else}
							{turnInputs?.[turn]?.[position] || ''}
						{/if}
					</div>
				{/each}
			{/each}
		</div>
	</div>
	<form class="hidden" on:submit|preventDefault={handleTurnInput}>
		<input
			autocomplete="off"
			id="input"
			type="text"
			maxlength={nameLength}
			bind:value={input}
			on:blur={handleUnfocus}
		/>
	</form>
	<Keyboard
		on:keyPress={handleKeyboardInput}
		on:back={handleKeyboardBack}
		on:enter={handleKeyboardEnter}
	/>

	{#if win}
		<p>You Win!</p>
		<button on:click={restartGame}>Restart</button>
	{/if}

	{#if lose}
		<p>You Lose!</p>
		<p>{word}</p>
		<button on:click={restartGame}>Restart</button>
	{/if}
</div>

<style>
	.hidden {
		opacity: 0;
		position: fixed;
		pointer-events: none;
		z-index: -9999;
	}

	div.display-wrapper {
		border: solid 1px rgb(225, 212, 212);
		border-radius: 5px;
		border-bottom-left-radius: 50px;
		padding: 2rem 2rem 3rem 2rem;

		margin-bottom: 2rem;
	}

	div.display {
		--box-size: min(4rem, calc(50vw / var(--wordLength)));

		display: grid;
		grid-template-columns: repeat(var(--wordLength), var(--box-size));
		grid-template-rows: repeat(var(--maxTurns), var(--box-size));
		place-content: center;

		padding: 2rem;

		border: solid 1px #68845c;
		background: #68845c0f;

		border-radius: 5px;
	}

	div.display div {
		text-transform: uppercase;

		line-height: var(--box-size);
		width: var(--box-size);

		border: solid #68845c 1px;

		text-align: center;
	}

	/* blink keyframes */
	@keyframes blink {
		0% {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	div.display.active div.cursor {
		animation: blink 1.5s steps(2) infinite;
	}

	.display div[data-status='1'] {
		color: white;
	}
	.display div[data-status='2'] {
		color: blue;
	}
	.display div[data-status='3'] {
		color: green;
	}
</style>
