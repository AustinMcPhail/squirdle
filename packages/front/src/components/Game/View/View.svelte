<script lang="ts">
	export let length: number;
	export let turns: number;
</script>

<div class="view" style:--wordLength={length} style:--maxTurns={turns} class:active={true}>
	<div class="inner-view">
		<slot />
	</div>

	<div class="hints">
		<p>Hints</p>
	</div>
</div>

<style>
	:root {
		--game-size: calc(100vw - var(--space, 1rem) * 2);
		--border: solid white 1px;
	}

	.hints {
		padding-block: var(--space);
	}
	.view {
		border: var(--border);
		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 5px;

		padding: var(--space);
		margin-bottom: var(--space);
	}
	@media (min-width: 400px) {
		.view {
			--game-size: min(75vw, 500px);
		}
	}

	.inner-view {
		height: var(--game-size);
		width: 100%;
	}
</style>
