/**
 * Peta WP untuk panel /dev. Sumber kebenarannya tetap docs/work-packages.md.
 * Setiap WP yang selesai memperbarui status dan langkah ceknya di sini (lihat docs/workflow.md).
 */

export type WpStatus =
	'backlog' | 'siap' | 'dikerjakan' | 'review' | 'siap-dicek' | 'revisi' | 'selesai' | 'terblokir';

export interface WpCheck {
	text: string;
	/** Tautan langsung ke halaman yang dicek, kalau ada. */
	href?: string;
}

export interface WorkPackage {
	id: string;
	title: string;
	milestone: 'M0' | 'M1' | 'M2' | 'M3' | 'M4';
	status: WpStatus;
	checks: WpCheck[];
}

export const STATUS_LABEL: Record<WpStatus, string> = {
	backlog: 'Backlog',
	siap: 'Siap',
	dikerjakan: 'Dikerjakan',
	review: 'Review',
	'siap-dicek': 'Siap dicek',
	revisi: 'Revisi',
	selesai: 'Selesai',
	terblokir: 'Terblokir'
};

/** Status yang berarti WP sedang berjalan (lane "Now"). */
const ACTIVE: ReadonlySet<WpStatus> = new Set(['dikerjakan', 'review', 'siap-dicek', 'revisi']);
/** Status yang berarti WP belum dimulai. */
const PENDING: ReadonlySet<WpStatus> = new Set(['backlog', 'siap']);

export const WP_MAP: readonly WorkPackage[] = [
	{
		id: 'WP-01',
		title: 'Fondasi SvelteKit & deploy',
		milestone: 'M0',
		status: 'selesai',
		checks: [
			{
				text: 'Buka di HP dan laptop. Beranda tampil dengan gaya Stabilo (garis tebal, bayangan padat).',
				href: '/'
			},
			{
				text: 'Ketuk ikon profil di kanan atas. Tugas hari ini dan pilihan tema muncul di sana.',
				href: '/'
			},
			{
				text: 'Ganti tema HP/OS ke gelap, atau pilih Gelap di menu profil. Semua teks nyaman dibaca.',
				href: '/'
			},
			{ text: 'Buka /dev. Peta WP menampilkan WP-01 dan WP-02 sebagai berikutnya.', href: '/dev' },
			{
				text: 'Di tab Komponen, coba tombol, chip, kartu, sheet, dan toast di HP.',
				href: '/dev?tab=komponen'
			}
		]
	},
	{
		id: 'WP-02',
		title: 'Supabase, auth, skema inti & data contoh',
		milestone: 'M0',
		status: 'review',
		checks: [
			{
				text: 'Buka /masuk, isi emailmu, lalu ketuk tautan di email. Setelah itu pilih nama pena (login Google menyusul setelah diaktifkan).',
				href: '/masuk'
			},
			{
				text: 'Beranda menampilkan tiga cerita contoh dari database (Mercusuar Pulau Garam, Pasar Malam Terakhir, Kota yang Lupa Hujan), bukan data tiruan lagi.',
				href: '/'
			},
			{
				text: 'Di /dev tab Akun uji, masuk sebagai lentera. Ikon profil berganti jadi L dan menu profil menampilkan lentera.',
				href: '/dev?tab=akun'
			},
			{
				text: 'Ketuk ikon profil lalu Profil: nama dan email hanya terlihat oleh pemilik akun. Keluar mengembalikanmu jadi tamu.',
				href: '/profil'
			}
		]
	},
	{
		id: 'WP-03',
		title: 'Baca & tulis cerita (solo)',
		milestone: 'M1',
		status: 'backlog',
		checks: [
			{ text: 'Buat cerita solo, lalu tulis 2 paragraf lanjutan.' },
			{ text: 'Coba paste ke editor. Ditolak dengan pesan.' },
			{ text: 'Buka cerita di HP. Setiap paragraf punya nama, waktu, dan badge proses.' }
		]
	},
	{
		id: 'WP-04',
		title: 'Ronde, suara & penutupan ronde',
		milestone: 'M1',
		status: 'backlog',
		checks: [
			{ text: 'Dengan 3 akun uji: kirim 2 kandidat, beri suara, tutup ronde lewat /dev.' },
			{ text: 'Ronde dengan 1 kandidat tanpa suara otomatis diterima.' },
			{ text: 'Ronde dengan 2 kandidat tanpa suara diperpanjang, lalu pemenangnya diundi.' }
		]
	},
	{
		id: 'WP-05',
		title: 'Pemegang estafet, bab & cerita tidur',
		milestone: 'M1',
		status: 'backlog',
		checks: [
			{ text: 'Menangkan ronde dengan akun uji. Sheet estafet muncul.' },
			{ text: 'Akun dengan 1 paragraf melihat constraint terkunci (1/3).' },
			{ text: 'Di /dev, set ukuran bab = 5 untuk memicu voting akhir bab.' }
		]
	},
	{
		id: 'WP-06',
		title: 'Gerbang membaca & kartu kutipan',
		milestone: 'M2',
		status: 'backlog',
		checks: [
			{ text: 'Sebagai akun baru, tombol Pilih terkunci dengan tulisan "0/6".' },
			{ text: 'Gulir pelan, tombol terbuka. Gulir cepat tidak dihitung sebagai membaca.' },
			{ text: 'Simpan kartu di HP (ketuk) dan di desktop (blok teks).' }
		]
	},
	{
		id: 'WP-07',
		title: 'Threads',
		milestone: 'M2',
		status: 'backlog',
		checks: [
			{ text: 'Langkah 3–4 prototipe berjalan dengan data asli.' },
			{ text: 'Ambil thread basi lalu menang. Thread berpindah jadi "baru disentuh".' }
		]
	},
	{
		id: 'WP-08',
		title: 'Tinta & ledger',
		milestone: 'M3',
		status: 'backlog',
		checks: [
			{ text: 'Jalankan skenario di /dev. Riwayat tinta sama dengan langkah terakhir prototipe.' },
			{ text: 'Baca dan pilih sampai batas harian. Tinta berhenti bertambah.' }
		]
	},
	{
		id: 'WP-09',
		title: 'Continuity Cop',
		milestone: 'M3',
		status: 'backlog',
		checks: [
			{ text: 'Langkah 5–6 prototipe (Seruni vs Sekar). Keberatan sah memberi +25.' },
			{ text: 'Keberatan yang tidak sah memindahkan taruhan ke penulis.' },
			{ text: 'Sengketa yang diputus setelah paragraf masuk narasi memunculkan luka kontinuitas.' }
		]
	},
	{
		id: 'WP-10',
		title: 'Penanya, Jejak, tugas & streak',
		milestone: 'M3',
		status: 'backlog',
		checks: [
			{ text: 'Menu profil menampilkan tugas dan streak hari ini dengan data asli.' },
			{ text: 'Tanya di sebuah paragraf, lalu jawab dari akun lain lewat kandidat yang menang.' },
			{ text: 'Profil menampilkan Jejak, bukan saldo tinta.' }
		]
	},
	{
		id: 'WP-11',
		title: 'Bounty, cabang & bangunkan cerita',
		milestone: 'M3',
		status: 'backlog',
		checks: [
			{ text: 'Pasang bounty 50 di sebuah thread, lalu menangkan dari akun lain. Bounty cair 45.' },
			{ text: 'Buat cabang dari kandidat yang kalah.' }
		]
	},
	{
		id: 'WP-12',
		title: 'Integritas tulisan & PWA dasar',
		milestone: 'M4',
		status: 'backlog',
		checks: [
			{ text: 'Pasang aplikasi ke layar utama HP.' },
			{ text: 'Matikan internet. Cerita yang pernah dibuka tetap bisa dibaca.' }
		]
	},
	{
		id: 'WP-13',
		title: 'Panduan pertama kali',
		milestone: 'M4',
		status: 'backlog',
		checks: [
			{ text: 'Daftar dengan akun baru. Panduan muncul dan bisa diselesaikan, atau dilewati.' }
		]
	}
];

/** WP yang sedang berjalan (lane "Now"), atau `undefined` kalau tidak ada. */
export function currentWp(map: readonly WorkPackage[]): WorkPackage | undefined {
	return map.find((wp) => ACTIVE.has(wp.status));
}

/** WP berikutnya: yang belum dimulai, setelah WP yang sedang berjalan. */
export function nextWp(map: readonly WorkPackage[]): WorkPackage | undefined {
	const now = currentWp(map);
	const from = now ? map.indexOf(now) + 1 : 0;
	return map.slice(from).find((wp) => PENDING.has(wp.status));
}

/** WP terakhir yang selesai (lane "Last Done"). */
export function lastDoneWp(map: readonly WorkPackage[]): WorkPackage | undefined {
	return map.findLast((wp) => wp.status === 'selesai');
}

/** Jumlah WP selesai, untuk progress keseluruhan. */
export function doneCount(map: readonly WorkPackage[]): number {
	return map.reduce((n, wp) => n + (wp.status === 'selesai' ? 1 : 0), 0);
}
