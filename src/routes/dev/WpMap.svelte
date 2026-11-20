<script lang="ts">
	import { Pill } from '#lib/components/index.ts';
	import { STATUS_LABEL, type WorkPackage, type WpStatus } from '#lib/dev/wp-map.ts';

	interface Props {
		map: readonly WorkPackage[];
		lastDone?: WorkPackage;
		now?: WorkPackage;
		next?: WorkPackage;
	}

	let { map, lastDone, now, next }: Props = $props();

	const TONE: Partial<Record<WpStatus, 'warn' | 'new' | 'ok'>> = {
		dikerjakan: 'new',
		review: 'warn',
		'siap-dicek': 'warn',
		revisi: 'warn',
		selesai: 'ok'
	};
</script>

<div class="lanes">
	<div class="lane">
		<span class="sec">Terakhir selesai</span>
		<b>{lastDone ? `${lastDone.id} · ${lastDone.title}` : 'Belum ada'}</b>
	</div>
	<div class="lane now">
		<span class="sec">Sekarang</span>
		<b>{now ? `${now.id} · ${now.title}` : 'Belum ada'}</b>
		{#if now}<span>{STATUS_LABEL[now.status]}</span>{/if}
	</div>
	<div class="lane">
		<span class="sec">Berikutnya</span>
		<b>{next ? `${next.id} · ${next.title}` : 'Belum ada'}</b>
	</div>
</div>

<ol class="list">
	{#each map as wp (wp.id)}
		{@const isNow = wp === now}
		{@const isNext = wp === next}
		<li class="wp" class:active={isNow} class:pending={wp.status === 'backlog' && !isNext}>
			<details open={isNow || isNext}>
				<summary>
					<span class="id">{wp.id}</span>
					<span class="title">{wp.title}</span>
					<span class="pills">
						<Pill>{wp.milestone}</Pill>
						{#if isNext}<Pill tone="new">Berikutnya</Pill>{/if}
						<Pill tone={TONE[wp.status]}>{STATUS_LABEL[wp.status]}</Pill>
					</span>
				</summary>
				<p class="sec">Cek di aplikasi</p>
				<ol class="checks">
					{#each wp.checks as check, i (i)}
						<li>
							{check.text}
							{#if check.href}
								<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
								<a href={check.href}>Buka {check.href}</a>
							{/if}
						</li>
					{/each}
				</ol>
			</details>
		</li>
	{/each}
</ol>

<style>
	.lanes {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 12px;
	}
	.lane {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 14px;
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--sunk);
		font-size: 13.5px;
	}
	.lane b {
		font-size: 16px;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
	.lane.now {
		background: var(--tinta-soft);
		box-shadow: var(--sh);
	}
	.list,
	.checks {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.list {
		gap: 10px;
	}
	.wp {
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--surface);
	}
	.wp.active {
		box-shadow: var(--sh-l);
	}
	.wp.pending {
		border-style: dashed;
		background: var(--sunk);
	}
	details {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 4px 14px;
	}
	details[open] {
		padding-bottom: 14px;
	}
	summary {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 4px 10px;
		align-items: center;
		min-height: var(--tap);
		padding: 8px 0;
		cursor: pointer;
		list-style: none;
	}
	summary::-webkit-details-marker {
		display: none;
	}
	.id {
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}
	.title {
		font-weight: 700;
	}
	.pills {
		grid-column: 2;
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.checks {
		gap: 8px;
		counter-reset: c;
		font-size: 14px;
	}
	.checks li {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding-left: 28px;
		position: relative;
		counter-increment: c;
	}
	.checks li::before {
		content: counter(c);
		position: absolute;
		left: 0;
		top: 1px;
		display: grid;
		place-items: center;
		width: 20px;
		height: 20px;
		border-radius: 6px;
		border: var(--b-thin);
		background: var(--hi);
		color: var(--on-hi);
		font-size: 11.5px;
		font-weight: 800;
	}
	.checks a {
		display: inline-flex;
		align-items: center;
		min-height: 32px;
		font-weight: 800;
		color: var(--tinta);
	}
</style>
