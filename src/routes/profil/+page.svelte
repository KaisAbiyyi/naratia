<script lang="ts">
	import { Button } from '#lib/components/index.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const joined = $derived(
		data.joinedAt
			? new Intl.DateTimeFormat('id-ID', {
					day: 'numeric',
					month: 'long',
					year: 'numeric',
					timeZone: 'Asia/Jakarta'
				}).format(new Date(data.joinedAt))
			: null
	);
</script>

<svelte:head>
	<title>{data.username} · Naratia</title>
</svelte:head>

<div class="profile">
	<header class="head">
		<span class="avatar" aria-hidden="true">{data.username.charAt(0).toUpperCase()}</span>
		<div class="names">
			<h1>{data.username}</h1>
			{#if joined}<p class="muted">Bergabung {joined}</p>{/if}
		</div>
	</header>

	<section class="card" aria-labelledby="sec-cerita">
		<h2 class="sec" id="sec-cerita">Ceritaku</h2>
		<p class="muted">Belum ada cerita. Menulis cerita sendiri segera hadir.</p>
	</section>

	<section class="card" aria-labelledby="sec-akun">
		<h2 class="sec" id="sec-akun">Akun</h2>
		{#if data.email}
			<p><span class="muted">Email:</span> <b>{data.email}</b></p>
			<p class="note">Email hanya terlihat oleh kamu.</p>
		{/if}
		<form method="POST" action="/keluar">
			<Button type="submit" block>Keluar</Button>
		</form>
	</section>
</div>

<style>
	.profile {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.avatar {
		display: grid;
		place-items: center;
		flex: none;
		width: 64px;
		height: 64px;
		border-radius: 50%;
		border: var(--b);
		box-shadow: var(--sh);
		background: var(--pink);
		color: var(--on-hi);
		font-size: 26px;
		font-weight: 800;
	}
	.names {
		display: flex;
		flex-direction: column;
		gap: 2px;
		min-width: 0;
	}
	h1 {
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.05;
		overflow-wrap: anywhere;
	}
	.card {
		display: flex;
		flex-direction: column;
		gap: 10px;
		padding: 16px;
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--surface);
	}
	.note {
		font-size: 12.5px;
		color: var(--muted);
	}
</style>
