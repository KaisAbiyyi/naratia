<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, TextField } from '#lib/components/index.ts';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();
	let sending = $state(false);

	const sent = $derived(form && 'sent' in form && form.sent);
	const emailValue = $derived((form && 'email' in form && form.email) || '');
	const error = $derived(form && 'error' in form ? form.error : null);
</script>

<svelte:head>
	<title>Masuk · Naratia</title>
</svelte:head>

<div class="auth">
	<header>
		<h1>Masuk ke Naratia</h1>
		<p class="muted">Tanpa password. Kami kirim tautan masuk ke email kamu.</p>
	</header>

	{#if data.callbackError}
		<p class="banner bad" role="alert">
			Tautan masuk sudah kedaluwarsa atau sudah dipakai. Minta tautan baru di bawah.
		</p>
	{/if}

	{#if !data.connected}
		<p class="banner bad" role="alert">
			Server belum terhubung ke database. Login belum bisa dipakai.
		</p>
	{:else if sent}
		<div class="banner ok" role="status">
			<strong>Cek email kamu.</strong>
			<span>
				Tautan masuk dikirim ke <b>{emailValue}</b>. Berlaku 1 jam. Tidak ada? Cek folder spam.
			</span>
		</div>
	{/if}

	<form
		method="POST"
		action="?/email"
		class="card"
		use:enhance={() => {
			sending = true;
			return async ({ update }) => {
				await update({ reset: false });
				sending = false;
			};
		}}
	>
		<input type="hidden" name="next" value={data.next} />
		<TextField
			label="Email"
			name="email"
			type="email"
			inputmode="email"
			autocomplete="email"
			required
			maxlength={254}
			value={emailValue}
			error={error && !sent ? error : null}
		/>
		<Button type="submit" variant="primary" block disabled={sending || !data.connected}>
			{sending ? 'Mengirim…' : sent ? 'Kirim ulang tautan' : 'Kirim tautan masuk'}
		</Button>
	</form>

	{#if data.google}
		<div class="or" aria-hidden="true"><span>atau</span></div>
		<form method="POST" action="?/google">
			<input type="hidden" name="next" value={data.next} />
			<Button type="submit" block>Masuk dengan Google</Button>
		</form>
	{/if}

	<p class="note">
		Dengan masuk, paragraf yang kamu kirim ke cerita kolaborasi memakai lisensi CC BY-NC-SA 4.0.
	</p>
</div>

<style>
	.auth {
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
	.banner {
		display: flex;
		flex-direction: column;
		gap: 2px;
		padding: 12px 14px;
		border-radius: var(--r);
		border: var(--b-thin);
		font-size: 14px;
	}
	.banner.ok {
		background: var(--ok-soft);
	}
	.banner.bad {
		background: var(--benang-soft);
	}
	.or {
		display: flex;
		align-items: center;
		gap: 10px;
		color: var(--muted);
		font-size: 12px;
		font-weight: 800;
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}
	.or::before,
	.or::after {
		content: '';
		flex: 1;
		height: 2px;
		background: var(--line);
	}
	.note {
		font-size: 12.5px;
		color: var(--muted);
	}
</style>
