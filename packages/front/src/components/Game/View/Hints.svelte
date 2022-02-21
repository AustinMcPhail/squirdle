<script lang="ts">
	let showCry = false;

	export let types: string[] = [];
	export let cry = '';

	$: showCry = types.length > 1 ? hints >= 2 : hints >= 1;
	$: hints = 0;
</script>

<div class="hints">
	<button class="shine" on:click={() => (hints += 1)}>Types</button>
	{#if hints > 0}
		<div class="types">
			<span>
				{types[0]}
			</span>
			{#if types[1] && hints > 1}
				{types[1]}
			{/if}
		</div>
	{/if}
	{#if showCry}
		<!-- content here -->
	{/if}
</div>

<style>
	.hints {
		padding-block: var(--space);

		display: flex;
		flex-direction: row-reverse;

		gap: var(--space);
	}

	/* pill split in half */
	.types {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		gap: var(--space);
		align-items: center;
	}

	/* Hint Button */

	@keyframes shine {
		0% {
			transform: translateX(-30px) rotate(-25deg);
		}

		100% {
			transform: translateX(250px) rotate(-25deg);
		}
	}

	.shine {
		margin: 1rem;
		background: var(--blue);
		color: #ffffff;

		width: 50px;
		height: 50px;

		font-size: 1.2rem;
		cursor: pointer;
		border-radius: 5px;
		position: relative;
		overflow: hidden;
		transition: all 100ms linear;

		border-radius: 10000px;

		margin: 0;

		border: none;

		box-shadow: 0px 5px 12px 0px rgba(0, 0, 0, 0.75);
	}

	.shine:hover {
		transform: scale(1.05);
	}

	.shine:hover::after {
		content: '';
		display: block;
		width: 75px;
		height: 175%;
		background: rgb(255, 255, 255);
		background: linear-gradient(
			90deg,
			rgba(255, 255, 255, 0) 0%,
			rgba(255, 255, 255, 1) 25%,
			rgba(255, 255, 255, 1) 50%,
			rgba(255, 255, 255, 1) 75%,
			rgba(255, 255, 255, 0) 100%
		);
		opacity: 0.5;
		position: absolute;
		top: -20px;
		left: 0;
		animation: shine 200ms linear;
		transform: translateX(250px);
	}
</style>
