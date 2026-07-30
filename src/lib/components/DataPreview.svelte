<script lang="ts">
	let { dataPreview = '' } = $props();
</script>

<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
	<h2 class="mb-1 text-lg font-bold">Data preview</h2>
	<p class="mb-5 text-xs text-neutral-500">Raw data that will be encoded in the QR code</p>
	<div
		class="min-h-6 rounded-lg bg-neutral-800 px-4 py-3.5 font-mono text-sm break-all text-neutral-200"
	>
		{dataPreview}
	</div>
</div>
