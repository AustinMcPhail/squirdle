<script lang="ts">
	export let length: number;
	export let turns: number;
	export let currentTurn: number;

	export let input: string;
	export let turnResults: string[][];
	export let turnInputs: string[][];
</script>

<div class="board">
	<div class="inner">
		{#each Array.from({ length: turns }) as _, turn}
			<div class="turn">
				{#each Array.from({ length }) as _, position}
					<div
						class="box"
						data-status={turnResults[turn] ? turnResults[turn][position] : ''}
						data-blank={turnInputs?.[turn]?.[position] === '_' ||
							(currentTurn === turn && input.charAt(position) === '_')}
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
</div>

<style>
	.board {
		position: relative;
		border: var(--inner-border);
		border-radius: 2px;
		height: 100%;
		display: grid;
	}

	.inner {
		width: 100%;
		display: grid;
		grid-template-rows: repeat(var(--maxTurns), 1fr);
	}

	.turn {
		display: inline-grid;
		grid-template-columns: repeat(var(--wordLength), 1fr);
	}

	.box {
		display: inline-grid;
		place-content: center;

		border: solid #68845c 1px;

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
		background: var(--incorrect);
	}
	.box[data-status='2'] {
		background: var(--exists);
	}
	.box[data-status='3'] {
		background: var(--correct);
	}

	.box[data-blank='true'] {
		background: var(--blank);
	}

	/* blink keyframes */
	@keyframes blink {
		0% {
			background: rgba(255, 255, 255, 0.1);
		}
	}

	:global(.active) .box.cursor {
		animation: blink 1.5s steps(2) infinite;
	}
</style>
