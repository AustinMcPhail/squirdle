<svelte:head>
	<title>Squirdle</title>
</svelte:head>
<div class="wrapper">
	<header>
		<h1>Squirdle</h1>
	</header>
	<main>
		<section class="game">
			<slot />
		</section>
	</main>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

	:global(body) {
		font-family: 'VT323', monospace;
		font-size: 2rem;

		background: rgb(27, 27, 27);

		color: white;
	}

	@media (min-width: 768px) {
		:global(body) {
			margin-inline: 1rem;
		}

		main {
			display: grid;
			place-items: center;
		}
	}

	.wrapper {
		overflow: hidden;
	}

	header,
	main {
		padding-inline: 1rem;
	}

	section.game {
		padding-block: 1rem;
	}
</style>
