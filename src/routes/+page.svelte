<script lang="ts">
	import { Card, Pill } from '#lib/components/index.ts';
	import { toast } from '#lib/toast.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const feed = $derived(data.feed);

	const soon = () => toast.show('Halaman cerita sedang disiapkan. Segera bisa dibaca di sini.');
</script>

<svelte:head>
	<title>Naratia</title>
	<meta name="description" content="Game menulis cerita bersama, satu paragraf per ronde." />
</svelte:head>

<div class="home">
	<header class="intro">
		<h1 class="visually-hidden">Beranda</h1>
		<p class="hello">{data.greeting}. Hari ke-{data.streakDays} beruntun menulis.</p>
	</header>

	{#if feed}
		<section aria-labelledby="sec-ronde">
			<h2 class="sec" id="sec-ronde">Ronde yang butuh kamu</h2>
			{#each feed.featured as round (round.id)}
				<Card onclick={soon} label="{round.title}, {round.summary}, {round.closesIn}">
					<span class="top">
						<span>{round.genre}</span><span class="due">{round.closesIn}</span>
					</span>
					<strong class="title">{round.title}</strong>
					<span class="sub">{round.summary}</span>
					<span class="pills">
						{#if round.constraint}<Pill tone="warn">Constraint: {round.constraint}</Pill>{/if}
						<Pill>{round.paragraphs} paragraf</Pill>
					</span>
				</Card>
			{:else}
				<p class="empty">Belum ada ronde yang menunggu. Lihat cerita lain di bawah.</p>
			{/each}
		</section>

		<section aria-labelledby="sec-lain">
			<h2 class="sec" id="sec-lain">Cerita lain</h2>
			{#each feed.others as story (story.id)}
				<Card variant="dim" onclick={soon} label="{story.title}, {story.state}">
					<span class="dim-title">{story.title}</span>
					<span>{story.state}</span>
				</Card>
			{:else}
				<p class="empty">Belum ada cerita lain.</p>
			{/each}
		</section>
	{:else}
		<div class="error" role="alert">
			<strong>Cerita belum bisa dimuat.</strong>
			<span>Koneksi ke server sedang bermasalah. Coba muat ulang sebentar lagi.</span>
		</div>
	{/if}
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}
	section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.hello {
		font-size: 13.5px;
		color: var(--muted);
		font-weight: 600;
	}
	.top {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 12px;
		font-weight: 700;
	}
	.due {
		color: var(--benang);
	}
	.title {
		font-size: 23px;
		font-weight: 800;
		letter-spacing: -0.035em;
		line-height: 1.05;
	}
	.sub {
		font-size: 13.5px;
		color: var(--muted);
		font-weight: 600;
	}
	.pills {
		display: flex;
		gap: 6px;
		flex-wrap: wrap;
	}
	.dim-title {
		color: var(--ink);
		font-weight: 700;
	}
	.empty {
		padding: 14px 16px;
		border-radius: var(--r-l);
		border: var(--b);
		border-style: dashed;
		background: var(--sunk);
		color: var(--muted);
		font-weight: 600;
	}
	.error {
		display: flex;
		flex-direction: column;
		gap: 4px;
		padding: 14px 16px;
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--benang-soft);
		color: var(--ink);
		font-size: 14px;
	}
</style>
