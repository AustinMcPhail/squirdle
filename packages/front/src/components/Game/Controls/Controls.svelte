<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Keyboard from './Keyboard.svelte';
	export let length: number;
	export let input: string;

	export let incorrectLetters: string[] = [];
	export let correctLetters: string[] = [];
	export let existingLetters: string[] = [];

	const dispatch = createEventDispatcher();
	function handleKeyboardInput({ detail: { key } }) {
		if (input.length < length) {
			input += key;
		}
	}
	function handleKeyboardBack() {
		input = input.length ? input.slice(0, input.length - 1) : '';
	}
	function handleKeyboardEnter() {
		dispatch('submit', { input });
	}
</script>

<Keyboard
	{incorrectLetters}
	{correctLetters}
	{existingLetters}
	on:keyPress={handleKeyboardInput}
	on:back={handleKeyboardBack}
	on:enter={handleKeyboardEnter}
/>
