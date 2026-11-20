/** Zona waktu default pengguna (WIB). Nanti bisa diganti per profil. */
export const DEFAULT_TIME_ZONE = 'Asia/Jakarta';

/** Jam lokal 0–23 di zona waktu tertentu. */
export function localHour(date: Date, timeZone = DEFAULT_TIME_ZONE): number {
	const hour = new Intl.DateTimeFormat('en-GB', { hour: 'numeric', hourCycle: 'h23', timeZone })
		.formatToParts(date)
		.find((p) => p.type === 'hour')?.value;
	return Number(hour ?? 0);
}

/** Salam sesuai waktu: pagi 04–10, siang 11–14, sore 15–17, malam 18–03. */
export function greetingFor(date: Date, timeZone = DEFAULT_TIME_ZONE): string {
	const h = localHour(date, timeZone);
	if (h >= 4 && h < 11) return 'Selamat pagi';
	if (h >= 11 && h < 15) return 'Selamat siang';
	if (h >= 15 && h < 18) return 'Selamat sore';
	return 'Selamat malam';
}
