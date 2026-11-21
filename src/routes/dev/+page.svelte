<script lang="ts">
	import { replaceState } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Tabs } from '#lib/components/index.ts';
	import { WP_MAP, currentWp, doneCount, lastDoneWp, nextWp } from '#lib/dev/wp-map.ts';
	import AccountSwitcher from './AccountSwitcher.svelte';
	import ComponentGallery from './ComponentGallery.svelte';
	import WpMap from './WpMap.svelte';
	import type { DevTab } from './+page.server';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// svelte-ignore state_referenced_locally
	let tab = $state<DevTab>(data.tab);

	const tabs = [
		{ value: 'peta' as const, label: 'Peta WP', count: WP_MAP.length },
		{ value: 'akun' as const, label: 'Akun uji' },
		{ value: 'komponen' as const, label: 'Komponen' }
	];

	function onchange(value: DevTab) {
		// Simpan tab di URL supaya tautan "Buka /dev?tab=komponen" langsung membuka tab itu.
		const search = value === 'peta' ? '' : `?tab=${value}`;
		// Path sudah lewat resolve(); aturan lint tidak mengenali template string.
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		void replaceState(`${resolve('/dev')}${search}`, page.state);
	}

	const lastDone = lastDoneWp(WP_MAP);
	const now = currentWp(WP_MAP);
	const next = nextWp(WP_MAP);
	const done = doneCount(WP_MAP);
</script>

<svelte:head>
	<title>Panel dev · Naratia</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="dev">
	<header class="head">
		<p class="sec">Hanya di preview</p>
		<h1>Panel dev</h1>
		<p class="muted">{done} dari {WP_MAP.length} WP selesai.</p>
	</header>

	<Tabs items={tabs} bind:value={tab} label="Bagian panel dev" {onchange}>
		{#snippet panel(value: DevTab)}
			{#if value === 'peta'}
				<WpMap map={WP_MAP} {lastDone} {now} {next} />
			{:else if value === 'akun'}
				<AccountSwitcher {...data.accounts} {form} />
			{:else}
				<ComponentGallery />
			{/if}
		{/snippet}
	</Tabs>
</div>

<style>
	.dev {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.head {
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	h1 {
		font-size: 30px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.05;
	}
</style>
