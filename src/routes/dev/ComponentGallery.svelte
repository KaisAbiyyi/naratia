<script lang="ts">
	import { Button, Card, Chip, Pill, Sheet, Tabs } from '#lib/components/index.ts';
	import { toast } from '#lib/toast.svelte.ts';

	let sheetOpen = $state(false);
	let demoTab = $state<'narasi' | 'threads' | 'ronde'>('narasi');
	const demoTabs = [
		{ value: 'narasi' as const, label: 'Narasi' },
		{ value: 'threads' as const, label: 'Threads', count: 3 },
		{ value: 'ronde' as const, label: 'Ronde 7' }
	];
</script>

<section aria-labelledby="g-btn">
	<h2 class="sec" id="g-btn">Button</h2>
	<div class="row">
		<Button variant="primary">Kirim kandidat</Button>
		<Button>Batal</Button>
		<Button variant="highlight">Pilih</Button>
		<Button size="sm">Kecil</Button>
		<Button disabled>Terkunci</Button>
	</div>
	<Button variant="primary" block>Tombol selebar layar</Button>
</section>

<section aria-labelledby="g-chip">
	<h2 class="sec" id="g-chip">Chip &amp; Pill</h2>
	<div class="row">
		<Chip
			tone="tinta"
			icon="drop"
			value={50}
			label="Tinta 50"
			onclick={() => toast.show('Chip tinta')}
		/>
		<Chip icon="card" value={2} label="2 kartu" onclick={() => toast.show('Chip kartu')} />
	</div>
	<div class="row">
		<Pill>Misteri</Pill>
		<Pill tone="warn">Constraint: Tanpa dialog</Pill>
		<Pill tone="new">6 paragraf baru</Pill>
		<Pill tone="ok">Selesai</Pill>
	</div>
</section>

<section aria-labelledby="g-card">
	<h2 class="sec" id="g-card">Card</h2>
	<Card>
		<strong class="ct">Kartu biasa</strong>
		<span class="muted">Garis tebal dan bayangan padat.</span>
	</Card>
	<Card onclick={() => toast.show('Kartu diketuk')}>
		<strong class="ct">Kartu yang bisa diketuk</strong>
		<span class="muted">Ketuk untuk melihat toast.</span>
	</Card>
	<Card variant="dim"><span>Kartu redup</span><span>ronde sepi</span></Card>
</section>

<section aria-labelledby="g-tabs">
	<h2 class="sec" id="g-tabs">Tabs</h2>
	<Tabs items={demoTabs} bind:value={demoTab} label="Contoh tab cerita">
		{#snippet panel(value: string)}
			<p class="muted">Isi tab <b>{value}</b>. Coba panah kiri/kanan di keyboard.</p>
		{/snippet}
	</Tabs>
</section>

<section aria-labelledby="g-sheet">
	<h2 class="sec" id="g-sheet">Sheet &amp; Toast</h2>
	<div class="row">
		<Button onclick={() => (sheetOpen = true)}>Buka sheet</Button>
		<Button onclick={() => toast.show('Kartu tersimpan dari ¶3 · nilai 6.')}>
			Tampilkan toast
		</Button>
	</div>
</section>

<Sheet bind:open={sheetOpen} title="Contoh sheet">
	<p>
		Sheet muncul dari bawah di HP dan di tengah di laptop. Tutup dengan Esc, tombol ×, atau ketuk
		latar.
	</p>
	<Button variant="primary" block onclick={() => (sheetOpen = false)}>Mengerti</Button>
</Sheet>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.row {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		align-items: center;
	}
	.ct {
		font-size: 18px;
		font-weight: 800;
		letter-spacing: -0.02em;
	}
</style>
