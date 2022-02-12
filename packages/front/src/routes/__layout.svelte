<script>
	import '../global.css';
	import { fade } from 'svelte/transition';

	let showRules = false;
</script>

<svelte:head>
	<title>Squirdle</title>
</svelte:head>

<!-- <div class="wrapper">
	<header>
		<button aria-label="Squirdle: Click to bring up rules" on:click={() => (showRules = true)}>
			<h1>Squirdle</h1>
		</button>
	</header>
	{#if showRules}
		<div class="rules" transition:fade>
			<div class="rulesHead">
				<h2>Introduction</h2>
				<button class="close" on:click={() => (showRules = false)}> X </button>
			</div>
			<p>
				Squirdle is a twist on the popular game Wordle, where you have to guess a random word
				through deductive reasoning! Play the original <a
					target="_blank"
					href="https://www.powerlanguage.co.uk/wordle/">here</a
				>.
			</p>

			<p>In this version, you'll be guessing a random Pokémon name.</p>
			<div class="legend">
				<p>
					<span class="square correct" /> Correct letter!
				</p>
				<p>
					<span class="square invalidPosition" /> Correct letter, but in the wrong position.
				</p>
			</div>

			<div>
				<p>Too hard? Narrow it down to a specific Generation:</p>
				<ol>
					<li><a href="/gen/1">I</a></li>
					<li><a href="/gen/2">II</a></li>
					<li><a href="/gen/3">III</a></li>
					<li><a href="/gen/4">IV</a></li>
					<li><a href="/gen/5">V</a></li>
					<li><a href="/gen/6">VI</a></li>
					<li><a href="/gen/7">VII</a></li>
					<li><a href="/gen/8">VIII</a></li>
				</ol>
			</div>

			<p class="credit">
				Created by <a target="_target" href="https://twitter.com/TheWhalePhail">@TheWhalePhail</a>
			</p>
		</div>
	{/if}
	<main>
		<section class="game">
<slot />
</section>
	</main>
</div> -->
<!-- 
<style>
	ol {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: space-between;
	}

	.legend {
		display: flex;
		flex-direction: column;
		gap: 2rem;

		justify-content: start;
	}

	.legend p {
		display: flex;
		align-items: center;
	}

	.square {
		display: inline-block;
		width: 2rem;
		height: 2rem;
		margin-right: 1rem;

		flex-shrink: 0;
	}
	.square.correct {
		background: rgba(0, 255, 0, 0.25);
	}
	.square.invalidPosition {
		background: rgba(0, 0, 255, 0.25);
	}

	.rules {
		position: absolute;
		background: #42543a;
		border: solid 1px #68845c;
		padding: 2rem;
		border-radius: 5px;
		margin: 1rem;
	}

	.rules > div.rulesHead {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.rules h2 {
		font-size: 1.75rem;
		margin-bottom: 1rem;
	}

	.rules a {
		color: white;
	}

	.rules > div .close {
		font-size: 2rem;
		color: #68845c;
		margin-bottom: 1rem;
	}

	.rules p {
		font-size: 2rem;
		margin-bottom: 1rem;
	}

	.rules p.credit {
		margin-top: 1rem;
		font-size: 1.5rem;
		text-align: right;
	}

	@media (min-width: 768px) {
		:global(body) {
			margin-inline: 1rem;
		}

		header,
		main {
			display: grid;
			place-items: center;
		}

		.rules {
			top: 50%; /* position the top  edge of the element at the middle of the parent */
			left: 50%; /* position the left edge of the element at the middle of the parent */
			transform: translate(-50%, -50%);
		}
	}

	.wrapper {
		min-height: 100vh;

		position: relative;
	}

	header,
	main {
		padding-inline: 1rem;
	}
	button {
		border: none;
		background: none;
		cursor: pointer;
	}

	section.game {
		padding-block: 1rem;
	}
	h1 {
		font-size: 3rem;
		color: white;
	}
</style> -->
<header>
	<h1>Squirdle</h1>
</header>
<div class="container">
	<main>
		<slot />
	</main>
	<aside>
		<h3>Rules</h3>
	</aside>
</div>

<style>
	.container {
		position: relative;

		height: 100vh;
		display: block;
	}

	header {
		text-align: center;
		padding-block: var(--space);
	}

	main {
		grid-area: main;
	}

	aside {
		position: fixed;
		top: 0 + var(--space);
		left: 0 + var(--space);
	}

	aside h3 {
		text-align: center;
	}
	@media (min-width: 768px) {
		aside {
			position: unset;
			grid-area: rules;
			padding-inline: var(--space);
		}
		.container {
			display: grid;
			grid-template-areas: 'main rules';
		}
	}
</style>
