<script>
	import '../global.css';

	let showRules = false;
</script>

<svelte:head>
	<title>Squirdle</title>
</svelte:head>

<div class="container">
	<header>
		<h1>Squirdle</h1>
	</header>
	<main>
		<slot />
	</main>
	{#if showRules}
		<aside>
			<h3>Rules</h3>
		</aside>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
	}
	header {
		padding-block: var(--space);
		font-size: clamp(2rem, 4vw, 5rem);
		text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
		text-align: center;
	}
	main {
		display: flex;
		justify-content: center;
		padding-inline: clamp(1rem, 4vw, 4rem);
	}
	aside {
		grid-area: rules;
	}
	aside h3 {
		text-align: center;
	}
	@media (min-width: 768px) {
		.container {
		}
	}
</style>
