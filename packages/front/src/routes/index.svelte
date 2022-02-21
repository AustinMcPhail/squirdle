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
</script>

<svelte:head>
	<title>Squirdle | Daily</title>
</svelte:head>

<Game {answer} {words} />
