<script lang="ts">
	import { Card, Icon, Pill } from '#lib/components/index.ts';
	import { toast } from '#lib/toast.svelte.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const home = $derived(data.home);

	const soon = () =>
		toast.show('Halaman cerita sedang disiapkan. Untuk sekarang Beranda masih contoh.');
</script>

<svelte:head>
	<title>Naratia</title>
	<meta name="description" content="Game menulis cerita bersama, satu paragraf per ronde." />
</svelte:head>

<div class="home">
	<header class="intro">
		<h1 class="visually-hidden">Beranda</h1>
		<p class="hello">{data.greeting}. Hari ke-{home.streakDays} beruntun menulis.</p>
	</header>

	<section aria-labelledby="sec-ronde">
		<h2 class="sec" id="sec-ronde">Ronde yang butuh kamu</h2>
		{#each home.featured as round (round.id)}
			<Card onclick={soon} label="{round.title}, {round.summary}, {round.closesIn}">
				<span class="top"><span>{round.genre}</span><span class="due">{round.closesIn}</span></span>
				<strong class="title">{round.title}</strong>
				<span class="sub">{round.summary}</span>
				<span class="pills">
					{#if round.constraint}<Pill tone="warn">Constraint: {round.constraint}</Pill>{/if}
					{#if round.newParagraphs}<Pill tone="new">{round.newParagraphs} paragraf baru</Pill>{/if}
				</span>
			</Card>
		{:else}
			<p class="empty">Belum ada ronde yang menunggu. Mulai cerita baru atau lihat cerita lain.</p>
		{/each}
	</section>

	<section aria-labelledby="sec-lain">
		<h2 class="sec" id="sec-lain">Cerita lain</h2>
		{#each home.others as story (story.id)}
			<Card variant="dim" onclick={soon} label="{story.title}, {story.state}">
				<span class="dim-title">{story.title}</span>
				<span>{story.state}</span>
			</Card>
		{:else}
			<p class="empty">Belum ada cerita lain.</p>
		{/each}
	</section>

	<section aria-labelledby="sec-tugas">
		<h2 class="sec" id="sec-tugas">Tugas hari ini</h2>
		<ul class="tasks">
			{#each home.tasks as task (task.label)}
				{@const done = task.done >= task.target}
				<li class="task" class:done>
					<span class="tk"><Icon name="check" size={13} /></span>
					<span>{task.label}</span>
					<span class="tn">
						<span class="visually-hidden">{done ? 'selesai' : 'progres'}</span>
						{task.done}/{task.target}
					</span>
				</li>
			{/each}
		</ul>
	</section>

	<p class="note">
		Isi Beranda ini masih contoh. Data asli menyusul setelah akun dan database siap.
	</p>
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
	.tasks {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.task {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: var(--tap);
		padding: 9px 0;
		border-bottom: 1.5px solid var(--line);
		font-size: 14px;
		font-weight: 600;
	}
	.tk {
		display: grid;
		place-items: center;
		flex: none;
		width: 22px;
		height: 22px;
		border-radius: 7px;
		border: var(--b-thin);
		color: transparent;
		background: var(--surface);
	}
	.done .tk {
		background: var(--ok);
		color: var(--surface);
	}
	.tn {
		margin-left: auto;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		font-size: 13px;
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
	.note {
		font-size: 13px;
		color: var(--muted);
		text-align: center;
	}
</style>
