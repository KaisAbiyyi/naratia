<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/** `dim` = kartu sekunder bergaris putus-putus, tanpa bayangan. */
		variant?: 'default' | 'dim';
		/** Kartu jadi tautan. */
		href?: string;
		/** Kartu jadi tombol. */
		onclick?: () => void;
		/** Nama yang dibacakan pembaca layar untuk kartu yang bisa diketuk. */
		label?: string;
		children: Snippet;
	}

	let { variant = 'default', href, onclick, label, children }: Props = $props();
</script>

{#if href}
	<!-- Pemanggil wajib memberi href yang sudah di-resolve(). -->
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
	<a {href} class="card interactive {variant}" aria-label={label}>{@render children()}</a>
{:else if onclick}
	<button type="button" class="card interactive {variant}" aria-label={label} {onclick}>
		{@render children()}
	</button>
{:else}
	<div class="card {variant}">{@render children()}</div>
{/if}

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 7px;
		width: 100%;
		padding: 16px;
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--surface);
		color: var(--ink);
		box-shadow: var(--sh-l);
		text-decoration: none;
		transition:
			transform 0.08s,
			box-shadow 0.08s;
	}
	.interactive:hover {
		transform: translate(-1px, -1px);
	}
	.interactive:active {
		transform: translate(3px, 3px);
		box-shadow: var(--sh-s);
	}
	.dim {
		padding: 12px 16px;
		min-height: var(--tap);
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
		background: var(--sunk);
		border-style: dashed;
		box-shadow: none;
		color: var(--muted);
	}
	.dim.interactive:active {
		transform: translate(1px, 1px);
		box-shadow: none;
	}
</style>
