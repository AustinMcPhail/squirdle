<script lang="ts">
	import type { Pokemon } from '@components/types';
	import { onMount } from 'svelte';
	export let answer: Pokemon;
	export let status: 'win' | 'lose';
	export let results: number[][] = [];

	$: shareableResult = results.map((result) =>
		result.map((value) => {
			if (value === 3) {
				return '🟢';
			} else if (value === 2) {
				return '🟡';
			} else if (value === 1) {
				return '⚪️';
			} else if (value === -1) {
				return '❌';
			}
		})
	);

	$: sharableStringResult =
		`Squirdle Results     (${results.length}/6)\n` +
		shareableResult.map((result) => result.join('')).join('\n');

	onMount(() => {
		const a = new Audio(answer.cry);
		a.volume = 0.25;
		a.play();
	});

	function handleCopy() {
		if (navigator.clipboard) navigator.clipboard.writeText(sharableStringResult);
	}
</script>

<p>
	{status === 'win' ? 'Nice Job!' : 'Good Try!'}
</p>

<div class="wrapper">
	<p class="name">
		{answer.name}
	</p>
	<img src={answer.image} width="50%" alt={answer.name} />
	<p>
		#{answer.id}
	</p>
</div>

<div>
	<p class="results">
		{#each shareableResult as turn}
			{#each turn as result}
				{result}
			{/each}
			<br />
		{/each}
	</p>
</div>
<div class="actions">
	<button on:click={handleCopy}>Copy Results</button>
	<a href="#reset" target="_self" on:click={() => location.reload()}>Reset</a>
</div>

<style>
	.actions {
		display: flex;
		justify-content: center;
		gap: var(--space);
	}
	button,
	a {
		background: none;
		border: 1px solid var(--white);

		font-size: var(--font-size);

		margin-block: var(--space);

		border-radius: 10px;
		color: var(--white);
		cursor: pointer;

		text-decoration: none;

		padding-inline: var(--space);
	}
	div.wrapper {
		display: grid;
		grid-template-columns: 1fr 5fr 1fr;

		justify-items: center;

		padding: var(--space);
	}
	p {
		text-align: center;
	}
	p.name {
		text-transform: capitalize;
	}

	p.results {
		transform: scale(0.75);
	}
</style>
