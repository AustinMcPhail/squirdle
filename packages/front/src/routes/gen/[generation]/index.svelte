<script context="module">
	import { getGenerationPokemon } from '@utils';

	export async function load({ params, fetch }) {
		const { data, error } = await getGenerationPokemon(params.generation, fetch);
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
	export let words: string[];
</script>

<Game {answer} {words} />
