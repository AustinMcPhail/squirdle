<script>
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';

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

	const handleBack = (key) => {
		dispatch('back');
	};

	const handleEnter = (key) => {
		dispatch('enter');
	};
	let currentlyPressedKeys = {};
	const keydownListener = (e) => {
		const key = e.key.toLowerCase();

		if (keys.includes(key)) {
			currentlyPressedKeys[key] = true;
			const button = window.document.getElementById(key);
			button.classList.add('active');
			handleKeyPress(key);
		}

		if (key === 'backspace') {
			currentlyPressedKeys['back'] = true;
			const button = window.document.getElementById('back');
			button.classList.add('active');
			handleBack();
		}

		if (key === 'enter') {
			currentlyPressedKeys['enter'] = true;
			const button = window.document.getElementById('enter');
			button.classList.add('active');
			handleEnter();
		}
	};
	const keyupListener = (e) => {
		const key = e.key.toLowerCase();

		if (keys.includes(key)) {
			currentlyPressedKeys[key] = false;
			const button = window.document.getElementById(key);
			button.classList.remove('active');
		}

		if (key === 'backspace') {
			currentlyPressedKeys['back'] = false;
			const button = window.document.getElementById('back');
			button.classList.remove('active');
		}

		if (key === 'enter') {
			currentlyPressedKeys['enter'] = false;
			const button = window.document.getElementById('enter');
			button.classList.remove('active');
		}
	};
</script>

<svelte:window on:keydown={keydownListener} on:keyup={keyupListener} />

<div class="keyboard">
	{#each keys as key}
		<button
			class="key"
			class:active={currentlyPressedKeys[key]}
			id={key}
			style:grid-area={key}
			on:click={() => handleKeyPress(key)}
		>
			{key}
		</button>
	{/each}
	<button
		class="key back"
		class:active={currentlyPressedKeys['back']}
		id="back"
		style:grid-area={'<'}
		on:click={handleBack}
	>
		{'<'}
	</button>
	<button
		class="key enter"
		class:active={currentlyPressedKeys['enter']}
		id="enter"
		style:grid-area={'>'}
		on:click={handleEnter}
	>
		GO
	</button>
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
		font-family: 'VT323', monospace;

		border: solid 1px #808fff;

		font-size: 2rem;

		text-transform: uppercase;

		padding: 0;

		height: 3rem;
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
	div.keyboard button.active {
		background: #3a4ddc;
	}
	div.keyboard button:hover,
	div.keyboard button:focus {
		background: #808fff;
	}
	div.keyboard button:active,
	div.keyboard button.active {
		background: #3a4ddc;
	}
</style>
