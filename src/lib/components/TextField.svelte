<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends Omit<HTMLInputAttributes, 'value'> {
		value?: string;
		label: string;
		name: string;
		hint?: string;
		/** Pesan galat dari server. Ditautkan ke input lewat aria-describedby. */
		error?: string | null;
	}

	let {
		label,
		name,
		hint,
		error,
		value = $bindable<string | undefined>(),
		...rest
	}: Props = $props();

	const uid = $props.id();
	const hintId = `${uid}-hint`;
	const errorId = `${uid}-error`;
	const describedBy = $derived(
		[hint && hintId, error && errorId].filter(Boolean).join(' ') || undefined
	);
</script>

<div class="field">
	<label for="{uid}-input">{label}</label>
	<input
		id="{uid}-input"
		{name}
		bind:value
		aria-invalid={error ? 'true' : undefined}
		aria-describedby={describedBy}
		{...rest}
	/>
	{#if hint}<p id={hintId} class="hint">{hint}</p>{/if}
	{#if error}<p id={errorId} class="error" role="alert">{error}</p>{/if}
</div>

<style>
	.field {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	label {
		font-size: 13px;
		font-weight: 800;
	}
	input {
		min-height: 48px;
		padding: 0 14px;
		border-radius: var(--r);
		border: var(--b);
		background: var(--surface);
		color: var(--ink);
		font: 600 16px/1.2 var(--f-ui);
	}
	input:focus-visible {
		outline: 3px solid var(--tinta);
		outline-offset: 2px;
	}
	input[aria-invalid='true'] {
		border-color: var(--benang);
	}
	.hint {
		font-size: 12.5px;
		color: var(--muted);
	}
	.error {
		font-size: 13px;
		font-weight: 700;
		color: var(--benang);
	}
</style>
