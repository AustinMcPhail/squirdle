<script>
	import '../global.css';
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
	<aside>
		<h3>Rules</h3>
	</aside>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-areas:
			'header'
			'main'
			'rules';
	}
	header {
		grid-area: header;

		padding-block: var(--space);

		font-size: clamp(2rem, 4vw, 5rem);
		text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
		text-align: center;
	}
	main {
		grid-area: main;
	}
	aside {
		grid-area: rules;
	}
	aside h3 {
		text-align: center;
	}
	@media (min-width: 768px) {
		.container {
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-template-areas:
				'header header'
				'main rules';
		}
	}
</style>
