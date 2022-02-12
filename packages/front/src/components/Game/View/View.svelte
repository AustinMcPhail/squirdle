<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	export let length: number;
	export let turns: number;
	export let active = false;
	const dispatch = createEventDispatcher();
	function displayClicked() {
		dispatch('focus');
	}
</script>

<div
	class="view"
	style:--wordLength={length}
	style:--maxTurns={turns}
	class:active
	on:click={displayClicked}
>
	<div class="inner-view">
		<slot />
	</div>
</div>
<div class="hints">
	<p>Hints</p>
</div>

<style>
	:root {
		--game-size: 90vw;
		--border: solid white 1px;
	}

	.hints {
		border-left: var(--border);
		border-right: var(--border);
		border-bottom: var(--border);

		border-bottom-left-radius: 25px;
		border-bottom-right-radius: 5px;

		padding: 0.25rem;
	}
	.view {
		height: var(--game-size);
		width: var(--game-size);

		border-left: var(--border);
		border-right: var(--border);
		border-top: var(--border);

		padding: 0.25rem;
	}
	/* @media (min-width: 400px) {
		.view {
			--game-size: min(75vw, 500px);
		}
	} */

	.inner-view {
		height: 100%;
	}
</style>
