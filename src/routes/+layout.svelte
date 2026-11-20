<script lang="ts">
	import '#lib/styles/index.css';
	import { AppBar, Sheet, Toaster } from '#lib/components/index.ts';
	import { HOME_DUMMY } from '#lib/dummy/home.ts';
	import { PROFILE_DUMMY } from '#lib/dummy/profile.ts';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();

	let tintaOpen = $state(false);
	let cardsOpen = $state(false);
</script>

<a class="skip" href="#main">Lewati ke konten</a>

<AppBar
	tinta={HOME_DUMMY.tinta}
	cards={HOME_DUMMY.cards}
	profile={PROFILE_DUMMY}
	devPanel={data.devPanel}
	onTinta={() => (tintaOpen = true)}
	onCards={() => (cardsOpen = true)}
/>

<main id="main" tabindex="-1">
	{@render children()}
</main>

<Sheet bind:open={tintaOpen} title="Tinta kamu: {HOME_DUMMY.tinta}">
	<p>
		Tinta adalah bahan bakar untuk ikut ronde. Kamu mendapatkannya dengan membaca, memilih, dan
		menang. Kamu memakainya untuk mengirim kandidat paragraf.
	</p>
	<p class="muted">Riwayat tinta akan tampil di sini.</p>
</Sheet>

<Sheet bind:open={cardsOpen} title="Kartu kutipan">
	<p class="empty">Belum ada kartu.</p>
	<p class="muted">
		Saat membaca cerita, ketuk sebuah kalimat untuk menyimpannya sebagai kartu. Kartu dipakai
		sebagai bukti saat menulis atau mengajukan keberatan.
	</p>
</Sheet>

<Toaster />

<style>
	main {
		display: flex;
		flex-direction: column;
		width: min(100%, var(--col));
		margin-inline: auto;
		padding: 16px max(var(--gutter), env(safe-area-inset-right, 0px)) 96px
			max(var(--gutter), env(safe-area-inset-left, 0px));
	}
	main:focus {
		outline: none;
	}
	.skip {
		position: absolute;
		left: 12px;
		top: -100px;
		z-index: 60;
		padding: 10px 14px;
		border-radius: var(--r);
		border: var(--b);
		background: var(--hi);
		color: var(--on-hi);
		font-weight: 800;
	}
	.skip:focus {
		top: 12px;
	}
	.empty {
		font-weight: 800;
	}
</style>
