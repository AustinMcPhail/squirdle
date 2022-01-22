<script context="module">
	export const prerender = true;

	import { getAllPokemon } from '@utils';
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		const { data, error } = await getAllPokemon(fetch);
		if (error) return error;
		return {
			props: {
				words: data
			}
		};
	}
</script>

<script>
	import Game from '@components/Game.svelte';
	export let words = [];
</script>

<Game {words} />
