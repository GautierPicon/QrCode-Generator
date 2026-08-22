<script lang="ts">
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

	function onSelect(extension: 'png' | 'webp' | 'jpeg' | 'svg') {
		open = false;
		download?.(extension);
	}

	$effect(() => {
		if (!open) return;
		function close(event: MouseEvent) {
			if (!dropdown?.contains(event.target as Node)) open = false;
		}
		document.addEventListener('click', close);
		return () => document.removeEventListener('click', close);
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
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="18"
					height="18"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-download-icon lucide-download"
					><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path
						d="m7 10 5 5 5-5"
					/></svg
				>
				Download
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-chevron-down-icon lucide-chevron-down"><path d="m6 9 6 6 6-6" /></svg
				>
			</button>
			{#if open}
				<div
					class="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg"
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
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-link-icon lucide-link"
					><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path
						d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
					/></svg
				>
				Copied!
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="lucide lucide-link-icon lucide-link"
					><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path
						d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
					/></svg
				>
				Copy URL
			{/if}
		</button>
	</div>
</div>
