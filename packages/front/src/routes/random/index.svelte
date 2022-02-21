<script context="module" lang="ts">
	export async function load({ stuff }) {
		return {
			props: stuff
		};
	}
</script>

<script lang="ts">
	import Game from '@components/Game';
	import type { Pokemon } from '@components/types';

	export let answer: Pokemon;
	export let words = [];
	let status: 'play' | 'win' | 'lose' = 'play';
</script>

<svelte:head>
	<title>Squirdle | Random</title>
</svelte:head>
<Game bind:status {answer} {words} />
