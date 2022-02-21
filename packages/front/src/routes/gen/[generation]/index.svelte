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
	export let words: string[];
</script>

<Game {answer} {words} />
