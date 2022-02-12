<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import Keyboard from './Keyboard.svelte';
	export let length: number;
	export let active = false;

	export let input: string;
	export let form: HTMLInputElement | undefined = undefined;

	const dispatch = createEventDispatcher();
	function onFocus() {
		if (!active) {
			dispatch('focus');
			active = true;
		}
	}
	function onBlur() {
		dispatch('blur');
	}

	function handleKeyboardInput({ detail: { key } }) {
		onFocus();
		if (input.length < length) {
			input += key;
		}
	}
	function handleKeyboardBack() {
		onFocus();
		input = input.length ? input.slice(0, input.length - 1) : '';
	}
	function handleKeyboardEnter() {
		onFocus();
		dispatch('submit', { input });
	}
</script>

<Keyboard
	{length}
	bind:form
	on:keyPress={handleKeyboardInput}
	on:back={handleKeyboardBack}
	on:enter={handleKeyboardEnter}
	on:focus={onFocus}
	on:blur={onBlur}
/>
