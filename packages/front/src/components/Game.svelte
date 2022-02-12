<script lang="ts">
	import { onMount } from 'svelte';

	import Keyboard from './Keyboard.svelte';
	import type { Pokemon } from './types';

	export let maxTurns = 6;

	export let answer: Pokemon;
	export let words = [];

	$: nameLength = answer.name.length;

	let currentTurn = 0;
	$: turnInputs = [];
	$: turnResults = [];

	const getTurnResults = (input) => {
		return input.map((char, i) => {
			// Correct character and correct position
			if (answer.name[i] === char) {
				return 3;
			}

			// Correct character but wrong position
			if (answer.name.includes(char)) {
				//TODO: Needs to account for matched and unmatched duplicates

				// Count duplicates
				let duplicates = answer.name.match(new RegExp(char, 'g')).length;
				let duplicatesInInput = input.filter((c) => char === c).length;

				if (duplicatesInInput === 1 && duplicates === 1) return 2;

				// Count matches ahead of index
				let charPositions = answer.name
					.split('')
					.slice(i + 1, answer.name.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				let inputPositions = input
					.slice(i + 1, input.length)
					.map((c, i) => (c === char ? i : -1))
					.filter((i) => i !== -1);
				const matchedAhead = inputPositions.filter((i) => charPositions.includes(i)).length;

				// Count matches behind index
				charPositions = answer.name
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
		if (input.length < answer.name.length) return;
		if (!words.includes(input)) return;

		const turn = input.split('');
		turnInputs = [...turnInputs, turn];
		turnResults = [...turnResults, getTurnResults(turn)];
		currentTurn += 1;

		win = input === answer.name;
		lose = currentTurn === maxTurns;
		input = '';
	};

	const restartGame = () => {
		input = '';
		win = false;
		lose = false;
		turnInputs = [];
		turnResults = [];
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
		active = true;
		if (input.length < answer.name.length) {
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

<div class="game" style:--wordLength={answer.name.length} style:--maxTurns={maxTurns}>
	<!-- {#each Array.from({ length: maxTurns }) as _, turn}
		<div class="turn">
			{#each Array.from({ length: nameLength }) as _, position}
				<div class="box" data-status={turnResults[turn] ? turnResults[turn][position] : ''}>
					&nbsp;
				</div>
			{/each}
		</div>
	{/each} -->
</div>

<!-- <div>
	<div class="display-wrapper">
		<div
			class="display"
			class:active
			style="--wordLength: {nameLength}; --maxTurns: {maxTurns}"
			on:click={handleDisplayClick}
			on:focus={handleDisplayClick}
		>
			{#if !win && !lose}
				{#each Array.from({ length: maxTurns }) as _, turn}
					{#each Array.from({ length: nameLength }) as _, position}
						<div
							data-status={turnResults[turn] ? turnResults[turn][position] : ''}
							class:cursor={input.length === position && currentTurn === turn}
							style:transition-delay={`${position * 0.1}s`}
						>
							{#if currentTurn === turn}
								{input.charAt(position) || ''}
							{:else}
								{turnInputs?.[turn]?.[position] || ''}
							{/if}
						</div>
					{/each}
				{/each}
			{:else}
				<div class="end">
					<p>You {win ? 'Win' : 'Lose'}!</p>
					<p>{answer.name}</p>
					<img src={answer.image} alt="{answer.name} official art" />
					<button class="restart" on:click={restartGame}>Restart</button>
				</div>
			{/if}
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
</div>

<style>
	img {
		max-width: 100px;
	}
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

	/* blink keyframes */
	@keyframes blink {
		0% {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	div.display.active div.cursor {
		animation: blink 1.5s steps(2) infinite;
	}

	div.display div {
		text-transform: uppercase;
		line-height: var(--box-size);
		border: solid #68845c 1px;
		text-align: center;
		transition: all 0.2s ease-in-out;
	}

	.display div[data-status='1'] {
		opacity: 0.5;
	}
	.display div[data-status='2'] {
		background: rgba(0, 0, 255, 0.25);
		transition: all 0.2s ease-in-out;
	}
	.display div[data-status='3'] {
		background: rgba(0, 255, 0, 0.25);
		transition: all 0.2s ease-in-out;
	}

	div.end {
		grid-column: 1 / span var(--wordLength);
		grid-row: 1 / span var(--maxTurns);

		display: grid;
		place-content: center;
	}

	button.restart {
		background: none;
		border: solid 1px #68845c;
		padding: 1rem;

		font-size: 2rem;

		color: #68845c;
		cursor: pointer;
	}

	button.restart {
		background: none;
		border: solid 1px #68845c;
		padding: 1rem;

		font-size: 2rem;

		color: #68845c;
		cursor: pointer;
	}
</style>
-->
<style>
	.game {
		--game-size: min(75vw, 500px);

		height: var(--game-size);
		width: var(--game-size);

		border: solid white 1px;
	}
	.turn {
		display: grid;
		grid-template-columns: repeat(var(--wordLength), 1fr);
		gap: 0.5rem;
	}
	.box {
		background: none;
		border: 1px solid white;
	}

	.box[data-status='1'] {
		opacity: 0.5;
	}
	.box[data-status='2'] {
		background: rgba(0, 0, 255, 0.25);
		transition: all 0.2s ease-in-out;
	}
	.box[data-status='3'] {
		background: rgba(0, 255, 0, 0.25);
		transition: all 0.2s ease-in-out;
	}
</style>
