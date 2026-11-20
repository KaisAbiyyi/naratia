<script lang="ts" module>
	export interface TabItem<V extends string> {
		value: V;
		label: string;
		/** Angka kecil di samping label, misalnya jumlah thread. */
		count?: number;
	}
</script>

<script lang="ts" generics="T extends string">
	import type { Snippet } from 'svelte';

	interface Props {
		items: TabItem<T>[];
		value: T;
		/** Nama daftar tab untuk pembaca layar. */
		label: string;
		onchange?: (value: T) => void;
		panel: Snippet<[T]>;
	}

	let { items, value = $bindable(), label, onchange, panel }: Props = $props();

	const uid = $props.id();
	const tabId = (v: T) => `${uid}-tab-${v}`;
	const panelId = `${uid}-panel`;
	const buttons: HTMLButtonElement[] = $state([]);

	function select(v: T) {
		if (v === value) return;
		value = v;
		onchange?.(v);
	}

	/** Pola tab WAI-ARIA: panah kiri/kanan, Home, End memindah fokus sekaligus memilih. */
	function targetIndex(key: string, index: number): number {
		const last = items.length - 1;
		if (key === 'ArrowRight') return index === last ? 0 : index + 1;
		if (key === 'ArrowLeft') return index === 0 ? last : index - 1;
		if (key === 'Home') return 0;
		if (key === 'End') return last;
		return -1;
	}

	function onkeydown(event: KeyboardEvent, index: number) {
		const target = targetIndex(event.key, index);
		if (target < 0) return;
		event.preventDefault();
		select(items[target].value);
		buttons[target]?.focus();
	}
</script>

<div class="tabs" role="tablist" aria-label={label} style:--n={items.length}>
	{#each items as item, i (item.value)}
		{@const on = item.value === value}
		<button
			bind:this={buttons[i]}
			type="button"
			role="tab"
			id={tabId(item.value)}
			class="tab"
			class:on
			aria-selected={on}
			aria-controls={panelId}
			tabindex={on ? 0 : -1}
			onclick={() => select(item.value)}
			onkeydown={(e) => onkeydown(e, i)}
		>
			{item.label}
			{#if item.count !== undefined}<i>{item.count}</i>{/if}
		</button>
	{/each}
</div>
<div role="tabpanel" id={panelId} aria-labelledby={tabId(value)} tabindex="0" class="panel">
	{@render panel(value)}
</div>

<style>
	.tabs {
		display: grid;
		grid-template-columns: repeat(var(--n), minmax(0, 1fr));
		border: var(--b);
		border-radius: var(--r);
		overflow: hidden;
		background: var(--surface);
	}
	.tab {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		min-height: var(--tap);
		padding: 8px 4px;
		font-size: 14px;
		font-weight: 700;
		color: var(--ink);
		border-right: var(--b);
	}
	.tab:last-child {
		border-right: 0;
	}
	.tab:focus-visible {
		outline-offset: -5px;
	}
	.on {
		background: var(--hi);
		color: var(--on-hi);
		font-weight: 800;
	}
	.tab i {
		font-style: normal;
		font-size: 11px;
		padding: 0 6px;
		border-radius: 999px;
		background: var(--surface);
		color: var(--ink);
		border: 1.5px solid var(--edge);
	}
	.panel {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding-top: 16px;
	}
	.panel:focus-visible {
		outline-offset: 4px;
		border-radius: var(--r-s);
	}
</style>
