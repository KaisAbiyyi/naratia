<script lang="ts">
	import type { Snippet } from 'svelte';
	import Icon from './Icon.svelte';

	interface Props {
		open: boolean;
		title: string;
		children: Snippet;
	}

	let { open = $bindable(false), title, children }: Props = $props();

	const uid = $props.id();
	let dialog: HTMLDialogElement | undefined = $state();

	// <dialog> bawaan browser memberi fokus terkunci, tombol Esc, dan latar yang inert.
	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		else if (!open && dialog.open) dialog.close();
	});

	function onclick(event: MouseEvent) {
		// Klik di latar (di luar isi sheet) menutup sheet.
		if (event.target === dialog) open = false;
	}
</script>

<dialog bind:this={dialog} aria-labelledby="{uid}-title" onclose={() => (open = false)} {onclick}>
	<div class="inner">
		<header>
			<h2 id="{uid}-title">{title}</h2>
			<button type="button" class="close" aria-label="Tutup" onclick={() => (open = false)}>
				<Icon name="x" size={18} />
			</button>
		</header>
		<div class="body">{@render children()}</div>
	</div>
</dialog>

<style>
	dialog {
		margin: auto 0 0;
		width: 100%;
		max-width: none;
		max-height: 90dvh;
		padding: 0;
		border: 3px solid var(--edge);
		border-bottom: 0;
		border-radius: var(--r-xl) var(--r-xl) 0 0;
		background: var(--surface);
		color: var(--ink);
		overscroll-behavior: contain;
	}
	dialog[open] {
		animation: up 0.26s cubic-bezier(0.2, 0.8, 0.2, 1);
	}
	dialog::backdrop {
		background: var(--veil, rgba(18, 18, 18, 0.45));
		animation: fade 0.2s;
	}
	.inner {
		display: flex;
		flex-direction: column;
		max-height: 90dvh;
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
	header {
		flex: none;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		padding: 16px 16px 8px;
	}
	h2 {
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.03em;
	}
	.close {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		border-radius: var(--r);
		border: var(--b);
		box-shadow: var(--sh-s);
		background: var(--surface);
	}
	.close:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}
	.body {
		display: flex;
		flex-direction: column;
		gap: 12px;
		overflow-y: auto;
		padding: 0 18px 22px 16px;
	}

	@media (min-width: 720px) {
		dialog {
			margin: auto;
			width: min(480px, 100% - 32px);
			border-bottom: 3px solid var(--edge);
			border-radius: var(--r-xl);
			box-shadow: 8px 8px 0 var(--edge);
		}
		dialog[open] {
			animation: pop 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
		}
		.inner {
			max-height: 85dvh;
		}
	}

	@keyframes up {
		from {
			transform: translateY(100%);
		}
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(12px);
		}
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
</style>
