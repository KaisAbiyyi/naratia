<script lang="ts">
	import { onMount } from 'svelte';
	import Icon from './Icon.svelte';
	import { theme } from '#lib/theme.svelte.ts';
	import { THEME_LABEL, nextThemePref } from '#lib/theme.ts';

	onMount(() => theme.sync());

	const icon = $derived(theme.pref === 'light' ? 'sun' : theme.pref === 'dark' ? 'moon' : 'system');
	const label = $derived(
		`Tema: ${THEME_LABEL[theme.pref]}. Ketuk untuk ganti ke ${THEME_LABEL[nextThemePref(theme.pref)]}.`
	);
</script>

<button
	type="button"
	class="ib"
	aria-label={label}
	title={label}
	data-theme-pref={theme.pref}
	onclick={() => theme.cycle()}
>
	<Icon name={icon} size={18} />
</button>

<style>
	.ib {
		display: grid;
		place-items: center;
		width: var(--tap);
		height: var(--tap);
		border-radius: var(--r);
		color: var(--ink);
		background: var(--surface);
		border: var(--b);
		box-shadow: var(--sh-s);
	}
	.ib:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}
</style>
