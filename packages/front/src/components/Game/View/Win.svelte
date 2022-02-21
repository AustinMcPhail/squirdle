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

<p>
	{answer.name}
</p>
<img src={answer.image} width="50%" alt={answer.name} />
<p>
	{answer.types.join(', ')}
</p>
