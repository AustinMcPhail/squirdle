<script>
	import '../global.css';

	let showRules = false;
</script>

<svelte:head>
	<title>Squirdle</title>
</svelte:head>

<div class="container">
	<header>
		<div>
			<img class="title" src="Squirdle.png" alt="Squirdle" />
			<div class="help">
				<button aria-label="Show Help" on:click={() => (showRules = !showRules)}>
					<img src="questionmark.png" alt="help" />
				</button>
			</div>
		</div>
	</header>
	{#if showRules}
		<aside>
			<h3>Rules</h3>
		</aside>
	{:else}
		<main>
			<slot />
		</main>
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

		display: flex;
		justify-content: center;
		align-items: center;
	}

	img.title {
		height: clamp(5rem, 10vw, 10vh);
	}

	.help {
		display: flex;
		justify-content: flex-end;
	}

	header > div {
		background: var(--blue);

		border: var(--border);

		border-radius: 10px;
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;

		display: grid;
		align-items: center;
		grid-template-columns: 1fr 1fr 1fr;

		width: clamp(40rem, 25vw, 100%);
	}

	header img {
		grid-column: 2;
	}

	header button {
		grid-column: 3;

		border: none;
		background: none;
		cursor: pointer;

		height: 100%;
		max-width: 3rem;
	}
	header button img {
		height: 100%;
		width: 100%;
	}
	main {
		display: flex;
		justify-content: center;
		/* padding-inline: clamp(1rem, 4vw, 4rem); */
	}
	aside {
		grid-area: rules;
	}
	aside h3 {
		text-align: center;
	}
	@media (min-width: 768px) {
	}
</style>
