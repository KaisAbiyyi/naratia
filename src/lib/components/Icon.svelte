<script lang="ts">
	import type { IconName } from './icons';

	let { name, size = 16 }: { name: IconName; size?: number } = $props();
</script>

<svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
	{#if name === 'drop'}
		<path d="M12 3c3.6 4.3 6 7.5 6 10.6a6 6 0 0 1-12 0C6 10.5 8.4 7.3 12 3z" fill="currentColor" />
	{:else if name === 'card'}
		<path d="M7 3h10a1 1 0 0 1 1 1v17l-6-4-6 4V4a1 1 0 0 1 1-1z" fill="currentColor" />
	{:else if name === 'check'}
		<path
			d="M5 12.5l4.5 4.5L19 7.5"
			fill="none"
			stroke="currentColor"
			stroke-width="2.6"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'lock'}
		<path d="M7.5 11V8a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="2" />
		<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor" />
	{:else if name === 'x'}
		<path
			d="M6 6l12 12M18 6L6 18"
			stroke="currentColor"
			stroke-width="2.2"
			stroke-linecap="round"
		/>
	{:else if name === 'back'}
		<path
			d="M15 5l-7 7 7 7"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		/>
	{:else if name === 'sun'}
		<circle cx="12" cy="12" r="4.2" fill="currentColor" />
		<path
			d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7 7 17M17 7l1.7-1.7"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
		/>
	{:else if name === 'moon'}
		<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor" />
	{:else if name === 'system'}
		<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2" />
		<path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" />
	{/if}
</svg>
