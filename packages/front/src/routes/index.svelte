<script context="module" lang="ts">
	import { getRandomPokemon } from '@utils';
	export async function load({ fetch }) {
		const { data, error } = await getRandomPokemon(fetch);
		if (error) return error;
		return {
			props: {
				answer: data.validPokemon,
				words: data.pokemon
			}
		};
	}
</script>

<script lang="ts">
	import Game from '@components/Game';
	import type { Pokemon } from '@components/types';

	export let answer: Pokemon;
	export let words = [];
</script>

<Game {answer} {words} />
