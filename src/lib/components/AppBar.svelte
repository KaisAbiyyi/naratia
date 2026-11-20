<script lang="ts">
	import { resolve } from '$app/paths';
	import Chip from './Chip.svelte';
	import ProfileMenu from './ProfileMenu.svelte';
	import type { ProfileSummary } from '#lib/dummy/profile.ts';

	interface Props {
		tinta: number;
		cards: number;
		profile: ProfileSummary;
		devPanel?: boolean;
		onTinta?: () => void;
		onCards?: () => void;
	}

	let { tinta, cards, profile, devPanel = false, onTinta, onCards }: Props = $props();
</script>

<header class="abar">
	<div class="row">
		<a class="logo" href={resolve('/')}>Naratia</a>
		{#if devPanel}
			<a class="dev" href={resolve('/dev')}>dev</a>
		{/if}
		<span class="grow"></span>
		<Chip
			tone="tinta"
			icon="drop"
			value={tinta}
			label="Tinta {tinta}, lihat penjelasan"
			onclick={onTinta}
		/>
		<Chip icon="card" value={cards} label="{cards} kartu kutipan" onclick={onCards} />
		<ProfileMenu {profile} />
	</div>
</header>

<style>
	.abar {
		position: sticky;
		top: 0;
		z-index: 10;
		background: var(--surface);
		border-bottom: var(--b);
		padding-top: env(safe-area-inset-top, 0px);
	}
	.row {
		display: flex;
		align-items: center;
		gap: 8px;
		width: min(100%, var(--col));
		height: 64px;
		margin-inline: auto;
		padding-inline: max(var(--gutter), env(safe-area-inset-left, 0px))
			max(var(--gutter), env(safe-area-inset-right, 0px));
	}
	.logo {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		font-weight: 800;
		font-size: 23px;
		letter-spacing: -0.04em;
		text-transform: lowercase;
		text-decoration: none;
	}
	.dev {
		display: inline-flex;
		align-items: center;
		min-height: var(--tap);
		padding: 0 6px;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
	}
	.grow {
		flex: 1;
	}
</style>
