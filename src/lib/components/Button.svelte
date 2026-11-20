<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface Props extends HTMLButtonAttributes {
		variant?: 'default' | 'primary' | 'highlight';
		size?: 'md' | 'sm';
		block?: boolean;
		/** Kalau diisi, tombol dirender sebagai tautan. */
		href?: string;
		children: Snippet;
	}

	let {
		variant = 'default',
		size = 'md',
		block = false,
		href,
		type = 'button',
		children,
		class: klass = '',
		...rest
	}: Props = $props();

	const cls = $derived(['btn', variant, size, { block }, klass]);
</script>

{#if href}
	<!-- Pemanggil wajib memberi href yang sudah di-resolve(). -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} class={cls}>{@render children()}</a>
{:else}
	<button {type} class={cls} {...rest}>{@render children()}</button>
{/if}

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		min-height: var(--tap);
		padding: 0 16px;
		border-radius: var(--r);
		font-weight: 800;
		font-size: 15px;
		text-decoration: none;
		text-align: center;
		background: var(--surface);
		color: var(--ink);
		border: var(--b);
		box-shadow: var(--sh);
		transition:
			transform 0.08s,
			box-shadow 0.08s;
	}
	.btn:hover {
		transform: translate(-1px, -1px);
		box-shadow: 4px 4px 0 var(--edge);
	}
	.btn:active {
		transform: translate(2px, 2px);
		box-shadow: 1px 1px 0 var(--edge);
	}
	.btn:disabled {
		opacity: 0.45;
		box-shadow: none;
		transform: none;
		cursor: not-allowed;
	}
	.primary {
		background: var(--tinta);
		color: var(--on-tinta);
	}
	.highlight {
		background: var(--hi);
		color: var(--on-hi);
	}
	.sm {
		/* Lebih ringkas, tapi area sentuh tetap ≥ 44 px. */
		padding: 0 13px;
		font-size: 14px;
	}
	.block {
		display: flex;
		width: 100%;
	}
</style>
