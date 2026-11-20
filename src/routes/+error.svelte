<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button } from '#lib/components/index.ts';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{notFound ? 'Tidak ditemukan' : 'Ada masalah'} · Naratia</title>
</svelte:head>

<div class="err">
	<p class="code">{page.status}</p>
	<h1>{notFound ? 'Halaman ini tidak ada' : 'Ada yang tidak beres'}</h1>
	<p class="muted">
		{notFound
			? 'Mungkin tautannya salah, atau halamannya belum dibuat.'
			: 'Coba muat ulang halaman sebentar lagi.'}
	</p>
	<Button variant="primary" href={resolve('/')}>Kembali ke Beranda</Button>
</div>

<style>
	.err {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 12px;
		padding-top: 24px;
	}
	.code {
		padding: 2px 10px;
		border-radius: 999px;
		border: var(--b-thin);
		background: var(--pink);
		color: var(--on-hi);
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}
	h1 {
		font-size: 28px;
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1.1;
	}
</style>
