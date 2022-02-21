<script lang="ts">
	import GameView, { Board, Win } from './View';
	import GameControls from './Controls';
	import type { Pokemon } from '../types';
	import { onMount } from 'svelte';

	export let status: 'play' | 'win' | 'lose' = 'play';

	export let maxTurns = 6;
	export let answer: Pokemon;
	export let words = [];
	let failedAttempt = false;

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

			if (char === '_') return -1;

			// Incorrect character
			return 1;
		});
	};

	let input = '';
	let win = false;
	let lose = false;

	let incorrectLetters: string[] = [];
	let correctLetters: string[] = [];
	let existingLetters: string[] = [];

	const handleTurnInput = (i: string) => {
		if (i.length < answer.name.length) return;
		if (currentTurn >= maxTurns) return;

		// TODO: Allow for spaces & check for words short than the target word
		if (!words.includes(i.replace(/_/g, ''))) {
			failedAttempt = true;
			return;
		}

		input = i;
		const turn = input.split('');
		turnInputs = [...turnInputs, turn];

		const res = getTurnResults(turn);
		turnResults = [...turnResults, res];

		turn.forEach((character, i) => {
			const value = res[i];
			if (value === 3 && !correctLetters.includes(character)) {
				correctLetters = [...correctLetters, character];
			} else if (value === 2 && !existingLetters.includes(character)) {
				existingLetters = [...existingLetters, character];
			} else if (!incorrectLetters.includes(character)) {
				incorrectLetters = [...incorrectLetters, character];
			}
		});

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
</script>

<div class="game">
	<GameView
		hints={status === 'play' ? 0 : Infinity}
		cry={answer.cry}
		types={answer.types}
		length={answer.name.length}
		turns={maxTurns}
		gameActive={status === 'play'}
	>
		{#if status === 'play'}
			<Board
				bind:failedAttempt
				length={answer.name.length}
				turns={maxTurns}
				{currentTurn}
				{input}
				{turnResults}
				{turnInputs}
			/>
		{:else if status === 'win'}
			<Win {answer} results={turnResults} />
		{:else if status === 'lose'}
			<p>Lost</p>
		{/if}
	</GameView>
	<GameControls
		{incorrectLetters}
		{correctLetters}
		{existingLetters}
		bind:input
		on:submit={handleSubmit}
		length={answer.name.length}
	/>
</div>

<style>
	.game {
		max-width: clamp(40rem, 25vw, 100%);

		height: 100%;
		width: 100%;
		display: grid;
	}
</style>
