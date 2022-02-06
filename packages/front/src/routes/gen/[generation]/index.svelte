<script context="module">
	// import { getGeneration, toWordList } from '@utils';

	export async function load({ params, fetch }) {
		// const { generation, error } = await getGeneration(params.generation, fetch);
		// if (error) return error;
		return {
			props: {
				// words: toWordList(generation.pokemon_species, 'name')
			}
		};
	}
</script>

<script>
	import Game from '@components/Game.svelte';
	export let words = [];
</script>

<Game answer={undefined} {words} />
