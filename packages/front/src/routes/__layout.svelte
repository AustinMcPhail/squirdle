<script>
	import '../global.css';
	import { fade, fly } from 'svelte/transition';

	let showRules = false;
	$: showGame = showRules === false;

	let rulesPos = 'unset';
	function handleGameOutroStart() {
		rulesPos = 'fixed';
	}
	function handleGameOutroEnd() {
		rulesPos = 'unset';
	}

	let gamePos = 'unset';
	function handleRulesOutroStart() {
		gamePos = 'fixed';
	}
	function handleRulesOutroEnd() {
		gamePos = 'unset';
	}
</script>

<svelte:head>
	<title>Squirdle</title>
</svelte:head>

<!-- {rulesDisplay} -->
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
		<aside
			style:position={rulesPos}
			out:fly={{ x: 200, duration: 300 }}
			in:fade={{ duration: 300, delay: 350 }}
			on:introstart={() => console.log('introstart')}
			on:outrostart={handleRulesOutroStart}
			on:outroend={handleRulesOutroEnd}
		>
			<div>
				<p>Squirdle is a game of guessing words. But not just any words. Pokémon names.</p>
				<p>
					The goal is to use guesses and deductive reasoning to guess the word, using the positions
					of incorrect and correct words as your hints.
				</p>
			</div>
		</aside>
	{:else}
		<main
			style:position={gamePos}
			out:fly={{ x: 200, duration: 300 }}
			in:fade={{ duration: 300, delay: 350 }}
			on:outrostart={handleGameOutroStart}
			on:outroend={handleGameOutroEnd}
		>
			<slot />
		</main>
	{/if}
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;

		overflow: hidden;
	}
	header {
		padding-block: var(--space);
		font-size: clamp(2rem, 4vw, 5rem);
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

		overflow: hidden;
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

		transition: transform 0.2s;
	}
	header button:hover,
	header button:focus {
		transform: rotate(12deg) scale(1.1);
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
		display: grid;
		place-items: center;
	}

	aside div {
		max-width: clamp(40rem, 25vw, 100%);
		padding: var(--space-2);
	}
	@media (min-width: 768px) {
	}
</style>
