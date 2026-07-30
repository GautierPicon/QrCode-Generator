<script lang="ts">
	let {
		container = $bindable<HTMLDivElement | undefined>(),
		copied = false,
		downloadPng,
		copyData
	}: {
		container?: HTMLDivElement | undefined;
		copied?: boolean;
		downloadPng?: () => void;
		copyData?: () => void;
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
			Download PNG
		</button>
		<button
			class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-transparent py-3 text-sm font-semibold text-white transition hover:opacity-85"
			onclick={() => copyData?.()}
		>
			{#if copied}
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
					class="lucide lucide-copy-check-icon lucide-copy-check"
					><path d="m12 15 2 2 4-4" /><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
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
					class="lucide lucide-copy-icon lucide-copy"
					><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
						d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
					/></svg
				>
				Copy data
			{/if}
		</button>
	</div>
</div>
