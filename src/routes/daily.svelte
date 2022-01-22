<script context="module">
	export const prerender = true;

	import { getAllPokemon, getRandomWordFromList } from '@utils';

	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ fetch }) {
		const { data, error } = await getAllPokemon(fetch);
		const dailyWord = getRandomWordFromList(data);

		if (error) return error;
		return {
			props: {
				words: data,
				word: dailyWord
			}
		};
	}
</script>

<script>
	import Game from '@components/Game.svelte';
	import { prerendering } from '$app/env';
	export let words = [];
	export let word = '';

	console.log({ words, word });
</script>

Prerendered? {prerendering}
<Game {words} {word} />
