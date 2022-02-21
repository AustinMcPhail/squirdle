<script lang="ts">
	import { onMount } from 'svelte';

	let showCry = false;

	export let types: string[] = [];
	export let cry = '';
	let cryPlayer: HTMLAudioElement;

	onMount(() => {
		cryPlayer = new Audio(cry);
		cryPlayer.volume = 0.25;
	});

	$: label = hints > 2 ? 'Sound' : 'Type';
	$: showCry = types.length === 2 ? hints > 2 : hints > 1;
	$: hints = 0;

	function playCry() {
		cryPlayer.play();
	}
</script>

<div class="hints">
	{#if hints < 3}
		<button class="shine" on:click={() => (hints += 1)}>{label}</button>
	{/if}
	{#if hints > 0}
		<div class="types">
			<span data-type={types[0]}>
				{types[0]}
			</span>
			{#if types[1] && hints > 1}
				<span data-type={types[1]}>
					{types[1]}
				</span>
			{/if}
		</div>
	{/if}
	{#if showCry}
		<button class="shine sound" on:click={playCry}>
			<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
				/></svg
			>
		</button>
	{/if}
</div>

<style>
	.hints {
		padding-block: var(--space);

		display: flex;
		flex-direction: row-reverse;

		gap: var(--space);
	}

	/* Hint Button */

	@keyframes shine {
		0% {
			transform: translateX(-30px) rotate(-25deg);
		}

		100% {
			transform: translateX(250px) rotate(-25deg);
		}
	}

	.shine {
		border-color: var(--blue);
		border-style: outset;
		border-width: 2px;

		margin: 1rem;
		background: var(--blue);
		color: #ffffff;

		height: 50px;

		font-size: 1.2rem;
		cursor: pointer;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		transition: all 100ms linear;

		border-radius: 10000px;

		margin: 0;

		box-shadow: 0px 5px 12px 0px rgba(0, 0, 0, 0.75);
	}

	.shine.sound {
		height: 50px;
		width: 50px;

		vertical-align: middle;

		border-color: var(--light-blue);
		background: var(--light-blue);
	}

	.shine:hover,
	.shine:focus {
		transform: scale(1.05);
	}

	.shine:active {
		transform: scale(0.95);
	}

	.shine:hover::after {
		content: '';
		display: block;
		width: 75px;
		height: 175%;
		background: rgb(255, 255, 255);
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 1) 25%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 1) 75%,
			rgba(255, 255, 255, 0) 100%
		);
		opacity: 0.5;
		position: absolute;
		top: -20px;
		left: 0;
		animation: shine 200ms linear;
		transform: translateX(250px);
	}

	/* Pokemon Typing Colors */

	.types {
		display: flex;
		flex-direction: row;

		align-items: center;

		border-color: var(--white);
		border-style: outset;
		border-width: 3px;

		border-radius: 10000px;
		overflow: hidden;

		text-transform: uppercase;
	}

	.types span {
		padding-block: calc(var(--space) / 2);
		padding-inline: 1rem;
	}

	span[data-type='normal'] {
		background: #a8a878;
	}
	span[data-type='fire'] {
		background: #f08030;
	}
	span[data-type='water'] {
		background: #6890f0;
	}
	span[data-type='electric'] {
		background: #f8d030;
	}
	span[data-type='grass'] {
		background: #78c850;
	}
	span[data-type='ice'] {
		background: #98d8d8;
	}
	span[data-type='fighting'] {
		background: #c03028;
	}
	span[data-type='poison'] {
		background: #a040a0;
	}
	span[data-type='ground'] {
		background: #e0c068;
	}
	span[data-type='flying'] {
		background: #a890f0;
	}
	span[data-type='psychic'] {
		background: #f85888;
	}
	span[data-type='bug'] {
		background: #a8b820;
	}
	span[data-type='rock'] {
		background: #b8a038;
	}
	span[data-type='ghost'] {
		background: #705898;
	}
	span[data-type='dragon'] {
		background: #7038f8;
	}
	span[data-type='dark'] {
		background: #705848;
	}
	span[data-type='steel'] {
		background: #b8b8d0;
	}
	span[data-type='fairy'] {
		background: #ffaec9;
	}
</style>
