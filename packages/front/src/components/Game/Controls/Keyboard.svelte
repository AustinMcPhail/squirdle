<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const keys = [
		'q',
		'w',
		'e',
		'r',
		't',
		'y',
		'u',
		'i',
		'o',
		'p',
		'a',
		's',
		'd',
		'f',
		'g',
		'h',
		'j',
		'k',
		'l',
		'z',
		'x',
		'c',
		'v',
		'b',
		'n',
		'm',
		'-'
	];

	const dispatch = createEventDispatcher();

	const handleKeyPress = (key) => {
		dispatch('keyPress', {
			key
		});
	};

	const handleBack = () => {
		dispatch('back');
	};
	const handleEnter = () => {
		dispatch('enter');
	};
</script>

<div class="keyboard">
	{#each keys as key}
		<button class="key" id={key} style:grid-area={key} on:click={() => handleKeyPress(key)}>
			{key}
		</button>
	{/each}
	<button class="key back" id="back" style:grid-area={'<'} on:click={handleBack}>
		{'<'}
	</button>
	<button class="key enter" id="enter" style:grid-area={'>'} on:click={handleEnter}> GO </button>
</div>

<style>
	div.keyboard {
		display: grid;
		grid-template-areas:
			'q w e r t y u i o p'
			'a s d f g h j k l .'
			'. z x c v b n m . .';

		gap: 2px;
	}

	div.keyboard button {
		cursor: pointer;

		background: none;

		color: white;

		border: solid 1px #808fff;

		font-size: 2rem;

		text-transform: uppercase;

		padding: 0;
		padding-block: 0.5rem;

		width: auto;
	}

	div.keyboard button.back {
		border-color: #ff5555a3;
		border-width: 5px;
	}
	div.keyboard button.enter {
		grid-column: span 2;
		border-color: #68845c;
		border-width: 5px;
	}
	div.keyboard button:hover,
	div.keyboard button:focus {
		background: #808fff;
	}
	div.keyboard button:active {
		background: #3a4ddc;
	}
</style>
