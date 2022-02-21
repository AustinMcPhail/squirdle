<script lang="ts">
	import type { Pokemon } from '@components/types';
	import { onMount } from 'svelte';
	export let answer: Pokemon;

	onMount(() => {
		const a = new Audio(answer.cry);
		a.volume = 0.25;
		a.play();
	});
</script>

<div>
	<p class="name">
		{answer.name}
	</p>
	<img src={answer.image} width="50%" alt={answer.name} />
	<p>
		#{answer.id}
	</p>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 5fr 1fr;

		justify-items: center;

		padding: var(--space);
	}
	p {
		text-align: center;
	}
	p.name {
		text-transform: capitalize;
	}
</style>
