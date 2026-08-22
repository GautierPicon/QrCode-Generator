<script lang="ts">
	import { gsap } from 'gsap';
	import { ChevronDown, Download, Link } from '@lucide/svelte';

	let {
		container = $bindable<HTMLDivElement | undefined>(),
		urlCopied = false,
		download,
		copyUrl
	}: {
		container?: HTMLDivElement | undefined;
		urlCopied?: boolean;
		download?: (extension: 'png' | 'webp' | 'jpeg' | 'svg') => void;
		copyUrl?: () => void;
	} = $props();

	const formats: { extension: 'png' | 'webp' | 'jpeg' | 'svg'; label: string }[] = [
		{ extension: 'png', label: 'PNG' },
		{ extension: 'svg', label: 'SVG' },
		{ extension: 'webp', label: 'WebP' },
		{ extension: 'jpeg', label: 'JPG' }
	];

	let open = $state(false);
	let dropdown: HTMLDivElement | undefined = $state();
	let chevronIcon: HTMLSpanElement | undefined = $state();

	function onSelect(extension: 'png' | 'webp' | 'jpeg' | 'svg') {
		open = false;
		download?.(extension);
	}

	$effect(() => {
		if (!chevronIcon) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		gsap.to(chevronIcon, { rotation: open ? 180 : 0, duration: 0.3, ease: 'power2.out' });
	});

	$effect(() => {
		if (!open) return;
		function close(event: MouseEvent) {
			if (!dropdown?.contains(event.target as Node)) open = false;
		}
		function onKeydown(event: KeyboardEvent) {
			if (event.key === 'Escape') open = false;
		}
		document.addEventListener('click', close);
		document.addEventListener('keydown', onKeydown);
		return () => {
			document.removeEventListener('click', close);
			document.removeEventListener('keydown', onKeydown);
		};
	});
</script>

<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
	<h2 class="mb-1 text-lg font-bold">Generated QR code</h2>
	<p class="mb-5 text-xs text-neutral-500">Your QR code will appear here automatically</p>

	<div class="flex justify-center py-7">
		<div bind:this={container}></div>
	</div>

	<div class="mb-4 grid grid-cols-2 gap-3">
		<div bind:this={dropdown} class="relative">
			<button
				class="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-base font-semibold text-black transition hover:opacity-85"
				onclick={() => (open = !open)}
				aria-haspopup="menu"
				aria-expanded={open}
			>
				<Download size={18} />
				Download
				<span class="inline-flex" bind:this={chevronIcon}>
					<ChevronDown size={16} />
				</span>
			</button>
			{#if open}
				<div
					class="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg"
					role="menu"
				>
					{#each formats as format (format.extension)}
						<button
							class="flex w-full cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
							onclick={() => onSelect(format.extension)}
						>
							{format.label}
						</button>
					{/each}
				</div>
			{/if}
		</div>
		<button
			class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-transparent py-3.5 text-sm font-semibold text-white transition hover:opacity-85"
			onclick={() => copyUrl?.()}
		>
			{#if urlCopied}
				<Link size={16} />
				Copied!
			{:else}
				<Link size={16} />
				Copy QR code URL
			{/if}
		</button>
	</div>
</div>
