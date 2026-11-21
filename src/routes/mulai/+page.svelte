<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from '#lib/components/index.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let saving = $state(false);
	// Kurung kurawal di atribut dibaca Svelte sebagai ekspresi, jadi pola diberikan lewat variabel.
	const usernamePattern = '[a-zA-Z0-9_]{3,20}';
</script>

<svelte:head>
	<title>Pilih nama pena · Naratia</title>
</svelte:head>

<div class="start">
	<header>
		<p class="sec">Langkah terakhir</p>
		<h1>Pilih nama pena</h1>
		<p class="muted">
			Nama ini tampil di setiap paragraf yang kamu tulis. Pilih yang kamu suka dilihat orang lain.
		</p>
	</header>

	<form
		method="POST"
		class="card"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update({ reset: false });
				saving = false;
			};
		}}
	>
		<input type="hidden" name="next" value={data.next} />
		<TextField
			label="Nama pena"
			name="username"
			autocomplete="username"
			autocapitalize="none"
			spellcheck="false"
			required
			minlength={3}
			maxlength={20}
			pattern={usernamePattern}
			value={form?.username ?? ''}
			hint="3–20 karakter: huruf kecil, angka, atau garis bawah (_)."
			error={form?.error}
		/>
		<Button type="submit" variant="primary" block disabled={saving}>
			{saving ? 'Menyimpan…' : 'Simpan dan mulai'}
		</Button>
	</form>
</div>

<style>
	.start {
		display: flex;
		flex-direction: column;
		gap: 16px;
		padding-top: 8px;
	}
	header {
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
	.card {
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: 16px;
		border-radius: var(--r-l);
		border: var(--b);
		background: var(--surface);
		box-shadow: var(--sh-l);
	}
</style>
