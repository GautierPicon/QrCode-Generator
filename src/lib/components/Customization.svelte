<script lang="ts">
	import { onMount } from 'svelte';

	let {
		size = $bindable(256),
		margin = $bindable(1),
		darkColor = $bindable('#000000'),
		lightColor = $bindable('#ffffff'),
		errorLevel = $bindable<'L' | 'M' | 'Q' | 'H'>('M'),
		logoUrl = $bindable<string | undefined>()
	} = $props();

	let darkInput: HTMLInputElement | undefined = $state();
	let lightInput: HTMLInputElement | undefined = $state();
	let logoInput: HTMLInputElement | undefined = $state();

	let previousErrorLevel = $state(errorLevel);

	let errorLevelDisabled = $derived(!!logoUrl);

	function handleLogoUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		previousErrorLevel = errorLevel as typeof previousErrorLevel;
		errorLevel = 'H';
		const reader = new FileReader();
		reader.onload = () => (logoUrl = reader.result as string);
		reader.readAsDataURL(file);
	}

	function removeLogo() {
		errorLevel = previousErrorLevel;
		logoUrl = undefined;
		if (logoInput) logoInput.value = '';
	}

	onMount(() => {
		if (darkInput) darkInput.value = darkColor;
		if (lightInput) lightInput.value = lightColor;
	});
</script>

<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
	<h2 class="mb-1 text-lg font-bold">Customization</h2>
	<p class="mb-5 text-xs text-neutral-500">Adjust QR code appearance and error correction</p>

	<div class="mb-5">
		<label class="mb-2.5 block text-sm font-semibold" for="size-slider">
			Size: {size}px
		</label>
		<input
			id="size-slider"
			type="range"
			min="128"
			max="512"
			step="64"
			bind:value={size}
			class="w-full cursor-pointer accent-white"
		/>
	</div>

	<div class="mb-5">
		<label class="mb-2.5 block text-sm font-semibold" for="margin-slider">
			Margin: {margin}
		</label>
		<input
			id="margin-slider"
			type="range"
			min="0"
			max="10"
			step="1"
			bind:value={margin}
			class="w-full cursor-pointer accent-white"
		/>
	</div>

	<div class="mb-5 grid grid-cols-2 gap-4">
		<div>
			<label class="mb-2 block text-sm font-semibold" for="dark-color">Dark color</label>
			<input
				id="dark-color"
				type="color"
				bind:this={darkInput}
				oninput={(e) => (darkColor = (e.target as HTMLInputElement).value)}
				class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
			/>
		</div>
		<div>
			<label class="mb-2 block text-sm font-semibold" for="light-color">Light color</label>
			<input
				id="light-color"
				type="color"
				bind:this={lightInput}
				oninput={(e) => (lightColor = (e.target as HTMLInputElement).value)}
				class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
			/>
		</div>
	</div>

	<label class="mb-2 block text-sm font-semibold" for="error-level"> Error correction level </label>
	<p class="mb-2 text-xs text-neutral-500">
		Higher levels make the code more resistant to damage but increase its complexity. L (7%) is best
		for clean prints, H (30%) for maximum durability.
		{#if logoUrl}
			<span class="text-neutral-400">Forced to H while a logo is set.</span>
		{/if}
	</p>
	<select
		id="error-level"
		bind:value={errorLevel}
		disabled={errorLevelDisabled}
		class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none disabled:opacity-50"
	>
		<option value="L">Low (7%)</option>
		<option value="M">Medium (15%)</option>
		<option value="Q">Quartile (25%)</option>
		<option value="H">High (30%)</option>
	</select>

	<div class="mt-5">
		<p class="mb-2 text-sm font-semibold">Logo</p>
		<input
			bind:this={logoInput}
			type="file"
			accept="image/*"
			class="hidden"
			onchange={handleLogoUpload}
		/>
		{#if logoUrl}
			<div class="rounded-lg border border-neutral-700 bg-neutral-800/50 p-3">
				<div class="flex items-center gap-4">
					<div
						class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-900"
					>
						<img src={logoUrl} alt="Logo preview" class="max-h-10 max-w-10 object-contain" />
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-white">Logo uploaded</p>
						<p class="text-xs text-neutral-500">Appears centered on the QR code</p>
					</div>
					<div class="flex gap-2">
						<button
							type="button"
							onclick={() => logoInput?.click()}
							class="cursor-pointer rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-700"
						>
							Change
						</button>
						<button
							type="button"
							onclick={removeLogo}
							class="cursor-pointer rounded-lg border border-neutral-700 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-neutral-700"
						>
							Remove
						</button>
					</div>
				</div>
			</div>
		{:else}
			<button
				type="button"
				onclick={() => logoInput?.click()}
				class="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-neutral-700 px-4 py-3 text-sm text-neutral-400 transition hover:border-neutral-500 hover:text-neutral-300"
			>
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
					class="lucide lucide-upload-icon lucide-upload"
					><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path
						d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
					/></svg
				>
				Upload logo
			</button>
		{/if}
	</div>
</div>
