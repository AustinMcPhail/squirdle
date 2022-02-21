<script context="module" lang="ts">
	import { getRandomPokemon } from '@utils';
	export async function load({ fetch }) {
		const { data, error } = await getRandomPokemon(fetch);
		if (error) return error;

		return {
			stuff: {
				answer: data.validPokemon,
				words: data.pokemon
			}
		};
	}
</script>

<slot />
