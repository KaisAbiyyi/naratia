/**
 * Panel /dev hanya menyala kalau PUBLIC_DEV_PANEL=1 dan bukan deploy production.
 * Pemeriksaan production dibuat terpisah supaya salah isi env di Vercel tetap tidak membuka panel.
 */
export function isDevPanelEnabled(
	flag: boolean | undefined,
	vercelEnv: string | undefined
): boolean {
	return flag === true && vercelEnv !== 'production';
}
