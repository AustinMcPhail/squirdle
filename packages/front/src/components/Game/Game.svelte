<script lang="ts">
	import GameView from './View';
	import GameControls from './Controls';
	import type { Pokemon } from '../types';

	export let status: 'play' | 'win' | 'lose' = 'play';

	export let maxTurns = 6;
	export let answer: Pokemon;
	export let words = [];
	let active = false;

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

	const handleTurnInput = (i: string) => {
		if (i.length < answer.name.length) return;
		if (currentTurn >= maxTurns) return;

		// TODO: Allow for spaces & check for words short than the target word
		if (!words.includes(i)) return;

		input = i;
		const turn = input.split('');
		turnInputs = [...turnInputs, turn];
		turnResults = [...turnResults, getTurnResults(turn)];

		checkGameState();
	};

	function checkGameState() {
		if (input === answer.name) {
			setTimeout(() => {
				status = 'win';
			}, 100 * answer.name.length);
			clearInput();
			currentTurn += 1;
		} else if (currentTurn + 1 >= maxTurns) {
			setTimeout(() => {
				status = 'lose';
			}, 100 * answer.name.length);
			clearInput();
			currentTurn += 1;
		} else {
			clearInput();
			currentTurn += 1;
		}
	}

	function handleSubmit(event: CustomEvent<{ input: string }>) {
		handleTurnInput(event.detail.input);
	}
	function clearInput() {
		input = '';
	}
	function restartGame() {
		clearInput();
		status = 'play';

		turnInputs = [];
		turnResults = [];
		currentTurn = 0;
	}

	let form: HTMLInputElement | undefined;
	function handleFocus() {
		if (win || lose) return;
		if (form) form.focus();
	}
	function handleBlur() {
		active = false;
	}
</script>

<div>
	<GameView
		bind:active
		on:focus={handleFocus}
		length={answer.name.length}
		turns={maxTurns}
		{turnResults}
		{turnInputs}
		{input}
		{currentTurn}
	/>
	<GameControls
		bind:active
		bind:input
		bind:form
		on:submit={handleSubmit}
		on:blur={handleBlur}
		length={answer.name.length}
	/>
</div>

<style>
	div {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}
</style>
