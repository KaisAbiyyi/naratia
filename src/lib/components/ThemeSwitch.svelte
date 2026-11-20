<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import type { IconName } from './icons';
	import { theme } from '#lib/theme.svelte.ts';
	import { THEME_LABEL, THEME_OPTIONS, type ThemePref } from '#lib/theme.ts';

	const ICON: Record<ThemePref, IconName> = { system: 'system', light: 'sun', dark: 'moon' };
	const uid = $props.id();

	onMount(() => theme.sync());
</script>

<!-- Radio bawaan: panah kiri/kanan berpindah pilihan, pembaca layar mengenali grupnya. -->
<div class="switch" role="radiogroup" aria-labelledby="{uid}-label">
	<span id="{uid}-label" class="visually-hidden">Tema</span>
	{#each THEME_OPTIONS as pref (pref)}
		<label class:on={theme.pref === pref}>
			<input
				type="radio"
				name="{uid}-theme"
				value={pref}
				checked={theme.pref === pref}
				onchange={() => theme.set(pref)}
			/>
			<Icon name={ICON[pref]} size={15} />
			<span>{THEME_LABEL[pref]}</span>
		</label>
	{/each}
</div>

<style>
	.switch {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		border: var(--b);
		border-radius: var(--r);
		overflow: hidden;
		background: var(--surface);
	}
	label {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		min-height: var(--tap);
		padding: 6px 4px;
		font-size: 13px;
		font-weight: 700;
		border-right: var(--b);
		cursor: pointer;
	}
	label:last-child {
		border-right: 0;
	}
	label.on {
		background: var(--hi);
		color: var(--on-hi);
		font-weight: 800;
	}
	label:has(input:focus-visible) {
		outline: 3px solid var(--tinta);
		outline-offset: -5px;
	}
	input {
		position: absolute;
		opacity: 0;
		width: 1px;
		height: 1px;
		margin: 0;
	}
</style>
