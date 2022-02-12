<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let length: number;
	export let turns: number;
	export let currentTurn: number;

	export let input: string;
	export let turnResults: string[][];
	export let turnInputs: string[][];

	export let active = false;

	const dispatch = createEventDispatcher();

	function displayClicked() {
		dispatch('focus');
	}
</script>

<div
	class="game"
	style:--wordLength={length}
	style:--maxTurns={turns}
	class:active
	on:click={displayClicked}
>
	{#each Array.from({ length: turns }) as _, turn}
		<div class="turn">
			{#each Array.from({ length }) as _, position}
				<div
					class="box"
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
		</div>
	{/each}
</div>

<style>
	.game {
		--game-size: min(75vw, 500px);

		height: var(--game-size);
		width: var(--game-size);

		display: flex;
		flex-direction: column;

		gap: 0.25rem;
	}

	.turn {
		height: calc(100% / var(--maxTurns));
		display: grid;
		grid-template-columns: repeat(var(--wordLength), 1fr);
		gap: 0.25rem;
	}

	.box {
		display: inline-grid;
		place-content: center;

		border: solid #68845c 1px;
		border-radius: 2px;

		text-transform: uppercase;

		line-height: calc(95% / var(--maxTurns));
		font-size: clamp(2rem, 10vw, 4rem);

		text-align: center;

		transition-property: opacity background-color;
		transition-duration: 0.25s;
		transition-timing-function: ease-in-out;
	}

	.box[data-status='1'] {
		opacity: 0.5;
	}
	.box[data-status='2'] {
		background: rgba(0, 0, 255, 0.25);
	}
	.box[data-status='3'] {
		background: rgba(0, 255, 0, 0.25);
	}

	/* blink keyframes */
	@keyframes blink {
		0% {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	.active .box.cursor {
		animation: blink 1.5s steps(2) infinite;
	}
</style>
