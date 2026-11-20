<script lang="ts">
	import Icon from './Icon.svelte';
	import ThemeSwitch from './ThemeSwitch.svelte';
	import { pendingTasks, type ProfileSummary } from '#lib/dummy/profile.ts';

	let { profile }: { profile: ProfileSummary } = $props();

	const uid = $props.id();
	const menuId = `${uid}-menu`;
	const pending = $derived(pendingTasks(profile.tasks));
	const done = $derived(profile.tasks.length - pending);
	const initial = $derived(profile.username.charAt(0).toUpperCase());
	const label = $derived(
		pending > 0
			? `Profil ${profile.username}, ${pending} tugas hari ini belum selesai`
			: `Profil ${profile.username}, semua tugas hari ini selesai`
	);
</script>

<!-- Popover bawaan browser: tutup dengan Esc atau ketuk di luar, tanpa JS tambahan. -->
<button type="button" class="avatar" popovertarget={menuId} aria-label={label}>
	<span aria-hidden="true">{initial}</span>
	{#if pending > 0}<span class="badge" aria-hidden="true">{pending}</span>{/if}
</button>

<div id={menuId} class="menu" popover="auto" aria-labelledby="{uid}-name">
	<header class="who">
		<span class="avatar big" aria-hidden="true">{initial}</span>
		<span class="names">
			<b id="{uid}-name">{profile.username}</b>
			<span class="muted">Hari ke-{profile.streakDays} beruntun menulis</span>
		</span>
	</header>

	<section class="block" aria-labelledby="{uid}-tasks">
		<h2 class="sec row" id="{uid}-tasks">
			<span>Tugas hari ini</span>
			<span class="count">{done}/{profile.tasks.length}</span>
		</h2>
		{#if profile.tasks.length}
			<ul class="tasks">
				{#each profile.tasks as task (task.label)}
					{@const isDone = task.done >= task.target}
					<li class="task" class:done={isDone}>
						<span class="tk"><Icon name="check" size={13} /></span>
						<span>{task.label}</span>
						<span class="tn">
							<span class="visually-hidden">{isDone ? 'selesai' : 'progres'}</span>
							{task.done}/{task.target}
						</span>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="muted">Belum ada tugas hari ini.</p>
		{/if}
	</section>

	<section class="block" aria-label="Tema">
		<h2 class="sec">Tema</h2>
		<ThemeSwitch />
	</section>
</div>

<style>
	.avatar {
		position: relative;
		display: grid;
		place-items: center;
		flex: none;
		width: var(--tap);
		height: var(--tap);
		border-radius: 50%;
		border: var(--b);
		box-shadow: var(--sh-s);
		background: var(--pink);
		color: var(--on-hi);
		font-weight: 800;
		font-size: 17px;
	}
	button.avatar:active {
		transform: translate(2px, 2px);
		box-shadow: none;
	}
	.avatar.big {
		width: 48px;
		height: 48px;
		font-size: 20px;
		box-shadow: none;
	}
	.badge {
		position: absolute;
		top: -6px;
		right: -7px;
		display: grid;
		place-items: center;
		min-width: 20px;
		height: 20px;
		padding: 0 5px;
		border-radius: 999px;
		border: var(--b-thin);
		background: var(--hi);
		color: var(--on-hi);
		font-size: 11.5px;
		font-weight: 800;
		font-variant-numeric: tabular-nums;
	}

	.menu {
		/* Selalu di bawah app bar, rata kanan dengan kolom konten. */
		position: fixed;
		inset: auto;
		top: calc(64px + env(safe-area-inset-top, 0px) + 8px);
		right: max(var(--gutter), calc((100vw - var(--col)) / 2 + var(--gutter)));
		width: min(340px, calc(100vw - 2 * var(--gutter)));
		max-height: calc(100dvh - 96px);
		margin: 0;
		padding: 16px;
		overflow-y: auto;
		border: 3px solid var(--edge);
		border-radius: var(--r-l);
		background: var(--surface);
		color: var(--ink);
		box-shadow: var(--sh-l);
	}
	.menu:popover-open {
		display: flex;
		flex-direction: column;
		gap: 18px;
		animation: drop 0.16s ease-out;
	}
	.who {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.names {
		display: flex;
		flex-direction: column;
		min-width: 0;
		font-size: 13px;
		font-weight: 600;
	}
	.names b {
		font-size: 17px;
		font-weight: 800;
		letter-spacing: -0.02em;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.block {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}
	.row {
		display: flex;
		justify-content: space-between;
	}
	.count {
		font-variant-numeric: tabular-nums;
	}
	.tasks {
		display: flex;
		flex-direction: column;
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.task {
		display: flex;
		align-items: center;
		gap: 10px;
		min-height: 40px;
		padding: 6px 0;
		border-bottom: 1.5px solid var(--line);
		font-size: 14px;
		font-weight: 600;
	}
	.task:last-child {
		border-bottom: 0;
	}
	.tk {
		display: grid;
		place-items: center;
		flex: none;
		width: 22px;
		height: 22px;
		border-radius: 7px;
		border: var(--b-thin);
		color: transparent;
		background: var(--surface);
	}
	.done .tk {
		background: var(--ok);
		color: var(--surface);
	}
	.tn {
		margin-left: auto;
		color: var(--muted);
		font-variant-numeric: tabular-nums;
		font-size: 13px;
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}
</style>
