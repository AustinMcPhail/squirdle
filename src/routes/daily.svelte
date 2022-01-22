<script context="module">
	export const prerender = true;

	import { getGeneration, getRandomWordFromList, toWordList } from '@utils';
	const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8];

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		const randomGeneration = GENERATIONS[Math.floor(Math.random() * GENERATIONS.length)];

		const { generation, error } = await getGeneration(randomGeneration, fetch);
		if (error) return error;
		return {
			props: {
				words: getRandomWordFromList(toWordList(generation.pokemon_species, 'name'))
			}
		};
	}
</script>

<script>
	import Game from '@components/Game.svelte';
	export let words = [];
</script>

<Game {words} />
