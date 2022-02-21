<script lang="ts">
	import Hints from './Hints.svelte';

	export let types: string[];
	export let cry: string;

	export let length: number;
	export let turns: number;
</script>

<div class="view" style:--wordLength={length} style:--maxTurns={turns} class:active={true}>
	<div class="inner-view">
		<slot />
	</div>

	<Hints {types} {cry} />
</div>

<style>
	:root {
		--game-size: calc(100vw - var(--space, 1rem) * 2);
	}

	.view {
		/* border: var(--border); */
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 5px;

		border-color: var(--outer-background);
		border-style: outset;
		border-width: 5px;

		padding: var(--space);
		margin-bottom: var(--space);

		background: var(--outer-background);
	}
	@media (min-width: 400px) {
		.view {
			--game-size: min(75vw, 500px);
		}
	}

	.inner-view {
		height: var(--game-size);
		width: 100%;

		background: var(--inner-background);
	}
</style>
