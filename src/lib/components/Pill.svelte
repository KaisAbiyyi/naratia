<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		tone = 'default',
		children
	}: { tone?: 'default' | 'warn' | 'new' | 'ok'; children: Snippet } = $props();
</script>

<span class="pill {tone}">{@render children()}</span>

<style>
	.pill {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		padding: 2px 9px;
		border-radius: 999px;
		font-size: 12px;
		font-weight: 700;
		line-height: 1.4;
		background: var(--surface);
		color: var(--ink);
		border: var(--b-thin);
		white-space: nowrap;
	}
	.warn {
		background: var(--hi);
		color: var(--on-hi);
	}
	.new {
		background: var(--tinta);
		color: var(--on-tinta);
	}
	.ok {
		background: var(--ok-soft);
		color: var(--ok);
	}
</style>
