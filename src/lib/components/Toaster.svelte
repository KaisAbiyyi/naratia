<script lang="ts">
	import { toast } from '#lib/toast.svelte.ts';
</script>

<!-- Wadah aria-live selalu ada di DOM supaya pembaca layar mengumumkan setiap pesan baru. -->
<div class="region" role="status" aria-live="polite">
	{#if toast.current}
		{#key toast.current.id}
			<button type="button" class="toast" onclick={() => toast.dismiss()}>
				{toast.current.text}
			</button>
		{/key}
	{/if}
</div>

<style>
	.region {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(18px + env(safe-area-inset-bottom, 0px));
		z-index: 50;
		display: flex;
		justify-content: center;
		padding: 0 var(--gutter);
		pointer-events: none;
	}
	.toast {
		width: min(100%, 480px);
		min-height: var(--tap);
		padding: 12px 14px;
		border-radius: 14px;
		background: var(--ink);
		color: var(--surface);
		border: var(--b);
		box-shadow: var(--sh);
		font-size: 13.5px;
		line-height: 1.45;
		font-weight: 600;
		text-align: left;
		pointer-events: auto;
		animation: rise 0.2s ease-out;
	}
	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
	}
</style>
