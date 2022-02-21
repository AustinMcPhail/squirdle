<script context="module" lang="ts">
	import { getGenerationPokemon } from '@utils';
	export async function load({ params, fetch }) {
		const { data, error } = await getGenerationPokemon(params.generation, fetch);
		if (error) return error;

		return {
			stuff: {
				answer: data.validPokemon,
				words: data.pokemon,
				gen: params.generation
			},
			props: {
				gen: params.generation
			}
		};
	}
</script>

<script>
	export let gen;
</script>

<svelte:head>
	<title>Squirdle | Gen {gen}</title>
</svelte:head>

<slot />
