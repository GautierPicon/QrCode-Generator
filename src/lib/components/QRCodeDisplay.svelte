<script lang="ts">
	let {
		container = $bindable<HTMLDivElement | undefined>(),
		urlCopied = false,
		downloadPng,
		copyUrl
	}: {
		container?: HTMLDivElement | undefined;
		urlCopied?: boolean;
		downloadPng?: () => void;
		copyUrl?: () => void;
	} = $props();
</script>

<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
	<h2 class="mb-1 text-lg font-bold">Generated QR code</h2>
	<p class="mb-5 text-xs text-neutral-500">Your QR code will appear here automatically</p>

	<div class="flex justify-center py-7">
		<div class="inline-flex rounded-2xl bg-white p-5">
			<div bind:this={container}></div>
		</div>
	</div>

	<div class="mb-4 grid grid-cols-2 gap-3">
		<button
			class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-base font-semibold text-black transition hover:opacity-85"
			onclick={() => downloadPng?.()}
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
			PNG
		</button>
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
