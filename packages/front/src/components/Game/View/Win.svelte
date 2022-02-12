<script lang="ts">
	import type { Pokemon } from '@components/types';
	export let answer: Pokemon;
</script>

<p>
	{answer.name}
</p>
<img src={answer.image} width="50%" alt={answer.name} />
<p>
	{answer.types.join(', ')}
</p>
