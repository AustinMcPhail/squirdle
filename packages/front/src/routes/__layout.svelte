<script context="module" lang="ts">
	import Layout from '@components/Layout/Layout.svelte';
	import { getDailyChallenge } from '@utils';
	export async function load({ fetch }) {
		const { data, error } = await getDailyChallenge(fetch);
		if (error) return error;

		return {
			stuff: {
				answer: data.validPokemon,
				words: data.pokemon
			}
		};
	}
</script>

<Layout>
	<slot />
</Layout>
