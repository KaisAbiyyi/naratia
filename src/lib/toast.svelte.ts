export interface ToastMessage {
	id: number;
	text: string;
}

const DEFAULT_MS = 3200;

class ToastState {
	current = $state<ToastMessage | null>(null);
	#seq = 0;
	#timer: ReturnType<typeof setTimeout> | undefined;

	show(text: string, ms = DEFAULT_MS) {
		clearTimeout(this.#timer);
		this.current = { id: ++this.#seq, text };
		this.#timer = setTimeout(() => this.dismiss(), ms);
	}

	dismiss() {
		clearTimeout(this.#timer);
		this.current = null;
	}
}

export const toast = new ToastState();
