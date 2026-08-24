<script lang="ts">
	import { onMount } from 'svelte';
	import { Upload } from '@lucide/svelte';
	import {
		cornerDotStyleLabels,
		cornerDotStyles,
		cornerSquareStyleLabels,
		cornerSquareStyles,
		dotStyleLabels,
		dotStyles,
		gradientLabels,
		gradientTypes,
		type CornerDotStyle,
		type CornerSquareStyle,
		type DotStyle,
		type GradientType
	} from '$lib/types';

	let {
		size = $bindable(256),
		margin = $bindable(1),
		darkColor = $bindable('#000000'),
		lightColor = $bindable('#ffffff'),
		errorLevel = $bindable<'L' | 'M' | 'Q' | 'H'>('M'),
		logoUrl = $bindable<string | undefined>(),
		dotStyle = $bindable<DotStyle>('square'),
		cornerSquareStyle = $bindable<CornerSquareStyle>('square'),
		cornerDotStyle = $bindable<CornerDotStyle>('square'),
		customEyeColors = $bindable(false),
		cornerSquareColor = $bindable(''),
		cornerDotColor = $bindable(''),
		dotGradient = $bindable<GradientType>('none'),
		dotColor2 = $bindable(''),
		bgGradient = $bindable<GradientType>('none'),
		lightColor2 = $bindable('')
	} = $props();

	let darkInput: HTMLInputElement | undefined = $state();
	let lightInput: HTMLInputElement | undefined = $state();
	let logoInput: HTMLInputElement | undefined = $state();
	let cornerSquareColorInput: HTMLInputElement | undefined = $state();
	let cornerDotColorInput: HTMLInputElement | undefined = $state();
	let dotColor2Input: HTMLInputElement | undefined = $state();
	let lightColor2Input: HTMLInputElement | undefined = $state();

	let previousErrorLevel = $state(errorLevel);

	let errorLevelDisabled = $derived(!!logoUrl);

	function toggleEyeColors() {
		if (!customEyeColors) return;
		cornerSquareColor ||= darkColor;
		cornerDotColor ||= darkColor;
	}

	function setGradient(kind: 'dots' | 'background') {
		const second = kind === 'dots' ? dotColor2 : lightColor2;
		if (!second) {
			if (kind === 'dots') dotColor2 = '#8b5cf6';
			else lightColor2 = '#8b5cf6';
		}
	}

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

	$effect(() => {
		if (cornerSquareColorInput && cornerSquareColor) {
			cornerSquareColorInput.value = cornerSquareColor;
		}
		if (cornerDotColorInput && cornerDotColor) cornerDotColorInput.value = cornerDotColor;
		if (dotColor2Input && dotColor2) dotColor2Input.value = dotColor2;
		if (lightColor2Input && lightColor2) lightColor2Input.value = lightColor2;
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

	<div class="mb-5">
		<label class="mb-2 block text-sm font-semibold" for="dot-style">Module style</label>
		<select
			id="dot-style"
			bind:value={dotStyle}
			class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
		>
			{#each dotStyles as style (style)}
				<option value={style}>{dotStyleLabels[style]}</option>
			{/each}
		</select>
	</div>

	<div class="mb-5 grid grid-cols-2 gap-4">
		<div>
			<label class="mb-2 block text-sm font-semibold" for="corner-square-style">
				Eye frame style
			</label>
			<select
				id="corner-square-style"
				bind:value={cornerSquareStyle}
				class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
			>
				{#each cornerSquareStyles as style (style)}
					<option value={style}>{cornerSquareStyleLabels[style]}</option>
				{/each}
			</select>
		</div>
		<div>
			<label class="mb-2 block text-sm font-semibold" for="corner-dot-style">Eye ball style</label>
			<select
				id="corner-dot-style"
				bind:value={cornerDotStyle}
				class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
			>
				{#each cornerDotStyles as style (style)}
					<option value={style}>{cornerDotStyleLabels[style]}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="mb-5">
		<label class="flex cursor-pointer items-center gap-2 text-sm font-semibold">
			<input
				type="checkbox"
				bind:checked={customEyeColors}
				onchange={toggleEyeColors}
				class="h-4 w-4 cursor-pointer accent-white"
			/>
			Custom eye colors
		</label>
		{#if customEyeColors}
			<div class="mt-2 grid grid-cols-2 gap-4">
				<div>
					<input
						type="color"
						bind:this={cornerSquareColorInput}
						value={cornerSquareColor || darkColor}
						oninput={(e) => (cornerSquareColor = (e.target as HTMLInputElement).value)}
						class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
					/>
					<p class="mt-1 text-xs text-neutral-500">Eye frames</p>
				</div>
				<div>
					<input
						type="color"
						bind:this={cornerDotColorInput}
						value={cornerDotColor || darkColor}
						oninput={(e) => (cornerDotColor = (e.target as HTMLInputElement).value)}
						class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
					/>
					<p class="mt-1 text-xs text-neutral-500">Eye balls</p>
				</div>
			</div>
		{/if}
	</div>

	<div class="mb-5 space-y-3">
		<p class="text-sm font-semibold">Gradients</p>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<label class="mb-2 block text-xs text-neutral-400" for="dot-gradient">Dots</label>
				<select
					id="dot-gradient"
					bind:value={dotGradient}
					onchange={() => setGradient('dots')}
					class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
				>
					{#each gradientTypes as type (type)}
						<option value={type}>{gradientLabels[type]}</option>
					{/each}
				</select>
			</div>
			<div>
				<label class="mb-2 block text-xs text-neutral-400" for="bg-gradient">Background</label>
				<select
					id="bg-gradient"
					bind:value={bgGradient}
					onchange={() => setGradient('background')}
					class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
				>
					{#each gradientTypes as type (type)}
						<option value={type}>{gradientLabels[type]}</option>
					{/each}
				</select>
			</div>
		</div>
		{#if dotGradient !== 'none'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<input
						type="color"
						bind:this={dotColor2Input}
						value={dotColor2 || '#8b5cf6'}
						oninput={(e) => (dotColor2 = (e.target as HTMLInputElement).value)}
						class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
					/>
					<p class="mt-1 text-xs text-neutral-500">Dots gradient end</p>
				</div>
			</div>
		{/if}
		{#if bgGradient !== 'none'}
			<div class="grid grid-cols-2 gap-4">
				<div>
					<input
						type="color"
						bind:this={lightColor2Input}
						value={lightColor2 || '#8b5cf6'}
						oninput={(e) => (lightColor2 = (e.target as HTMLInputElement).value)}
						class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
					/>
					<p class="mt-1 text-xs text-neutral-500">Background gradient end</p>
				</div>
			</div>
		{/if}
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
				<Upload size={16} />
				Upload logo
			</button>
		{/if}
	</div>
</div>
