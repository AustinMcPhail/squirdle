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
			<a href="/" on:click={() => (showRules = false)}>
				<img class="title" src="Squirdle.png" alt="Squirdle" />
			</a>

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
				<div class="guesses">
					<p>
						<span class="correct" /> is a correct guess.
					</p>
					<p>
						<span class="exists" /> is a letter that exists in the answer one or more times.
					</p>
					<p>
						<span class="incorrect" /> is an incorrect guess.
					</p>
					<p>
						<span class="blank" /> is a space spot, allowing for guesses that are of shorter length than
						the actual answer.
					</p>
				</div>
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
		padding-bottom: var(--space);
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

		display: grid;
		align-items: center;
		grid-template-columns: 1fr 1fr 1fr;

		width: clamp(40rem, 25vw, 100%);

		overflow: hidden;
	}

	header a {
		grid-column: 2;
	}

	header a {
		display: grid;
		place-items: center;
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

	aside > div {
		max-width: clamp(40rem, 25vw, 100%);
		padding: var(--space-2);
	}
	@media (min-width: 768px) {
		header {
			padding-top: var(--space);
		}

		header > div {
			border-top-right-radius: 10px;
			border-top-left-radius: 10px;
		}

		aside div {
			padding-inline: 0;
		}
	}

	aside p {
		--size: 50px;
		text-shadow: -1px 0 var(--blue), 0 1px var(--blue), 1px 0 var(--blue), 0 -1px var(--blue);
	}

	.guesses {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		margin-top: var(--space-2);
	}

	.guesses p {
		display: flex;
		align-items: center;
		gap: var(--space);
	}

	.correct {
		flex-shrink: 0;
		display: inline-block;
		border: var(--border);
		background-color: var(--correct);
		height: var(--size);
		width: var(--size);
	}

	.exists {
		flex-shrink: 0;
		display: inline-block;
		border: var(--border);
		background-color: var(--exists);
		height: var(--size);
		width: var(--size);
	}
	.incorrect {
		flex-shrink: 0;
		display: inline-block;
		border: var(--border);
		background-color: var(--incorrect);
		height: var(--size);
		width: var(--size);
	}
	.blank {
		flex-shrink: 0;
		display: inline-block;
		border: var(--border);
		background-color: var(--blank);
		height: var(--size);
		width: var(--size);
	}
</style>
