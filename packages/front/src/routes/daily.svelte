<script context="module" lang="ts">
	export const prerender = true;

	import { getDailyChallenge } from '@utils';
	export async function load({ fetch }) {
		const { data, error } = await getDailyChallenge(fetch);
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
	import Game from '@components/Game.svelte';
	import type { Pokemon } from '@components/types';

	export let answer: Pokemon;
	export let words = [];
</script>

<Game {answer} {words} />
