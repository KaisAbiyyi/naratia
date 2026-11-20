<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';

	interface Props {
		value: string | number;
		/** Teks untuk pembaca layar, misalnya "Tinta 50, lihat riwayat". */
		label: string;
		icon?: IconName;
		tone?: 'hi' | 'tinta';
		onclick?: () => void;
	}

	let { value, label, icon, tone = 'hi', onclick }: Props = $props();
</script>

<button type="button" class="chip {tone}" aria-label={label} {onclick}>
	{#if icon}<Icon name={icon} size={14} />{/if}
	<span>{value}</span>
</button>

<style>
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		min-width: var(--tap);
		height: var(--tap);
		padding: 0 11px;
		border-radius: var(--r);
		background: var(--hi);
		color: var(--on-hi);
		border: var(--b);
		box-shadow: var(--sh-s);
		font-weight: 800;
		font-size: 15px;
		font-variant-numeric: tabular-nums;
	}
	.chip:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}
	.tinta {
		background: var(--tinta);
		color: var(--on-tinta);
	}
</style>
