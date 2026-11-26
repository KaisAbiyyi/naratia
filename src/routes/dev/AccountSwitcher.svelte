<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '#lib/components/index.ts';
	import { TEST_ACCOUNTS } from '#lib/dev/accounts.ts';

	interface Props {
		connected: boolean;
		passwordSet: boolean;
		current: string | null;
		currentIsTest: boolean;
		form: { error?: string; reset?: boolean } | null | undefined;
	}

	let { connected, passwordSet, current, currentIsTest, form }: Props = $props();
	let busy = $state<string | null>(null);

	const ready = $derived(connected && passwordSet);
</script>

<section class="block" aria-labelledby="g-akun">
	<h2 class="sec" id="g-akun">Masuk sebagai akun uji</h2>
	<p class="muted">
		Sekarang: <b>{current ?? 'tamu (belum masuk)'}</b>{currentIsTest ? ' · akun uji' : ''}
	</p>

	{#if !connected}
		<p class="banner bad" role="alert">
			Env Supabase belum diisi. Lihat <code>.env.example</code>.
		</p>
	{:else if !passwordSet}
		<p class="banner bad" role="alert">
			<code>DEV_TEST_PASSWORD</code> belum diisi, jadi tombol masuk dimatikan.
		</p>
	{/if}

	<ul class="accounts">
		{#each TEST_ACCOUNTS as account (account.username)}
			<li>
				<form
					method="POST"
					action="?/masuk"
					use:enhance={() => {
						busy = account.username;
						return async ({ update }) => {
							await update();
							busy = null;
						};
					}}
				>
					<input type="hidden" name="akun" value={account.username} />
					<Button type="submit" block disabled={!ready || busy !== null}>
						<span class="who">
							<b>{account.username}</b>
							<span class="muted">{account.note}</span>
						</span>
					</Button>
				</form>
			</li>
		{/each}
	</ul>

	<h2 class="sec">Data contoh</h2>
	<form
		method="POST"
		action="?/reset"
		use:enhance={() => {
			busy = 'reset';
			return async ({ update }) => {
				await update({ reset: false });
				busy = null;
			};
		}}
	>
		<Button type="submit" block disabled={!ready || !currentIsTest || busy !== null}>
			{busy === 'reset' ? 'Mereset…' : 'Reset data contoh'}
		</Button>
	</form>
	<p class="note">
		Menghapus lalu membuat ulang tiga cerita contoh. Cerita buatan pengguna tidak disentuh. Hanya
		bisa saat masuk sebagai akun uji.
	</p>

	{#if form?.error}
		<p class="banner bad" role="alert">{form.error}</p>
	{:else if form?.reset}
		<p class="banner ok" role="status">Data contoh sudah direset.</p>
	{/if}
</section>

<style>
	.block {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.accounts {
		display: flex;
		flex-direction: column;
		gap: 10px;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.who {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 2px;
		text-align: left;
		font-weight: 700;
	}
	.who .muted {
		font-size: 12.5px;
		font-weight: 600;
	}
	.banner {
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
	.note {
		font-size: 12.5px;
		color: var(--muted);
	}
	code {
		font-size: 12.5px;
	}
</style>
