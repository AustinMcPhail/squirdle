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
		'm'
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
	<button class="key sp" id="back" style:grid-area={'sp'} on:click={handleBack}>
		{'_'}
	</button>
	<button class="key enter" id="enter" style:grid-area={'>'} on:click={handleEnter}> GO </button>
</div>

<style>
	div.keyboard {
		display: grid;
		grid-template-areas:
			'q w e r t y u i o p'
			'a s d f g h j k l m'
			'. z x c sp sp v b n .';

		gap: 2px;
	}

	div.keyboard button {
		cursor: pointer;

		background: none;

		color: white;

		border: var(--border);
		background: var(--blue);

		font-size: 2rem;

		text-transform: uppercase;

		padding: 0;
		padding-block: 0.5rem;

		width: auto;
	}

	div.keyboard button.back {
		background: var(--red);
		border-width: 5px;

		border-bottom-left-radius: 10px;
	}

	div.keyboard button.sp {
		background: var(--cyan);
		border-width: 5px;

		border-bottom-right-radius: 10px;
		border-bottom-left-radius: 10px;
	}
	div.keyboard button.enter {
		background: var(--green);
		border-width: 5px;

		border-bottom-right-radius: 10px;
	}
	div.keyboard button:hover,
	div.keyboard button:focus {
		background: var(--light-blue);
	}
	div.keyboard button:active {
		background: var(--slate);
	}
</style>
