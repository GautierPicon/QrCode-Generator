<script lang="ts">
	import { onMount } from 'svelte';
	import github from '$lib/assets/github.png';
	import QRCodeStyling from 'qr-code-styling';

	type Label = { label: string; placeholder: string };

	const labels: Record<string, Label> = {
		text: { label: 'Text content', placeholder: 'Hello, world!' },
		url: { label: 'URL', placeholder: 'https://example.com' },
		email: { label: 'Email address', placeholder: 'name@example.com' },
		phone: { label: 'Phone number', placeholder: '+1 555 123 4567' },
		sms: { label: 'SMS number', placeholder: '+1 555 123 4567' },
		wifi: { label: 'WiFi (SSID:Password)', placeholder: 'MyNetwork:mypassword' },
		contact: { label: 'Contact info', placeholder: 'John Doe, +1 555 123 4567' }
	};

	const types = ['text', 'url', 'email', 'phone', 'sms', 'wifi', 'contact'] as const;

	let currentType: string = $state('text');
	let content = $state('Hello, world!');
	let size = $state(256);
	let margin = $state(4);
	let darkColor = $state('#000000');
	let lightColor = $state('#ffffff');
	let errorLevel = $state<'L' | 'M' | 'Q' | 'H'>('M');
	let previousErrorLevel = $state<'L' | 'M' | 'Q' | 'H'>('M');

	let logoUrl: string | undefined = $state();
	let logoInput: HTMLInputElement | undefined = $state();

	let qrContainer: HTMLDivElement | undefined = $state();
	let qrCode: QRCodeStyling | undefined = $state();
	let copied = $state(false);

	function buildData() {
		const val = content.trim();
		if (!val) return labels[currentType].placeholder;
		if (currentType === 'email') return 'mailto:' + val;
		if (currentType === 'phone') return 'tel:' + val;
		if (currentType === 'sms') return 'sms:' + val;
		return val;
	}

	function handleLogoUpload(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		previousErrorLevel = errorLevel;
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

	function render() {
		if (!qrContainer) return;
		const data = buildData();
		if (!data) return;
		const options = {
			width: size,
			height: size,
			data,
			margin,
			type: 'canvas' as const,
			qrOptions: { errorCorrectionLevel: errorLevel },
			dotsOptions: { color: darkColor, type: 'square' as const },
			backgroundOptions: { color: lightColor },
			image: logoUrl,
			imageOptions: {
				crossOrigin: 'anonymous' as const,
				margin: 6,
				imageSize: 0.4,
				hideBackgroundDots: true
			}
		};
		if (!qrCode) {
			qrCode = new QRCodeStyling(options);
			qrCode.append(qrContainer);
		} else {
			qrCode.update(options);
		}
	}

	let currentConfig = $derived(labels[currentType]);
	let dataPreview = $derived(buildData() || '—');

	$effect(() => {
		render();
	});

	onMount(render);

	function downloadPng() {
		qrCode?.download({ name: 'qrcode', extension: 'png' });
	}

	function copyData() {
		navigator.clipboard.writeText(buildData());
		copied = true;
		setTimeout(() => (copied = false), 1200);
	}
</script>

<svelte:head>
	<title>QR Code Generator</title>
</svelte:head>

<div class="min-h-screen bg-neutral-950 text-white">
	<div class="px-6 pt-12 pb-6 text-center">
		<h1 class="mb-2 text-4xl font-bold">QR Code Generator</h1>
		<p class="text-base text-neutral-400">
			Generate QR codes for text, URLs, and more with customizable styling
		</p>
	</div>

	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 pb-12 md:grid-cols-2">
		<!-- Colonne gauche -->
		<div class="flex flex-col gap-5">
			<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
				<h2 class="mb-1 flex items-center gap-2 text-lg font-bold">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="lucide lucide-qr-code-icon lucide-qr-code"
						><rect width="5" height="5" x="3" y="3" rx="1" /><rect
							width="5"
							height="5"
							x="16"
							y="3"
							rx="1"
						/><rect width="5" height="5" x="3" y="16" rx="1" /><path
							d="M21 16h-3a2 2 0 0 0-2 2v3"
						/><path d="M21 21v.01" /><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path
							d="M12 3h.01"
						/><path d="M12 16v.01" /><path d="M16 12h1" /><path d="M21 12v.01" /><path
							d="M12 21v-1"
						/></svg
					>
					QR Code Data
				</h2>
				<p class="mb-5 text-xs text-neutral-500">
					Choose data type and enter information to encode
				</p>

				<select
					bind:value={currentType}
					onchange={() => (content = '')}
					class="mb-5 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
				>
					{#each types as type (type)}
						<option value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
					{/each}
				</select>

				<label class="mb-2 block text-sm font-semibold" for="content-input">
					{currentConfig.label}
				</label>
				<textarea
					id="content-input"
					bind:value={content}
					placeholder={currentConfig.placeholder}
					class="min-h-35 w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				></textarea>
			</div>

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
						step="8"
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
							bind:value={darkColor}
							class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
						/>
					</div>
					<div>
						<label class="mb-2 block text-sm font-semibold" for="light-color">Light color</label>
						<input
							id="light-color"
							type="color"
							bind:value={lightColor}
							class="h-10 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 p-1"
						/>
					</div>
				</div>

				<label class="mb-2 block text-sm font-semibold" for="error-level">
					Error correction level
				</label>
				<p class="mb-2 text-xs text-neutral-500">
					Higher levels make the code more resistant to damage but increase its complexity. L (7%)
					is best for clean prints, H (30%) for maximum durability.
					{#if logoUrl}
						<span class="text-neutral-400">Forced to H while a logo is set.</span>
					{/if}
				</p>
				<select
					id="error-level"
					bind:value={errorLevel}
					disabled={!!logoUrl}
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
								<div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-neutral-900">
									<img
										src={logoUrl}
										alt="Logo preview"
										class="max-h-10 max-w-10 object-contain"
									/>
								</div>
								<div class="min-w-0 flex-1">
									<p class="truncate text-sm font-medium text-white">Logo uploaded</p>
									<p class="text-xs text-neutral-500">
										Appears centered on the QR code
									</p>
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
		</div>

		<!-- Colonne droite -->
		<div class="flex flex-col gap-5">
			<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
				<h2 class="mb-1 text-lg font-bold">Generated QR code</h2>
				<p class="mb-5 text-xs text-neutral-500">Your QR code will appear here automatically</p>

				<div class="flex justify-center py-7">
					<div class="inline-flex rounded-2xl bg-white p-5">
						<div bind:this={qrContainer}></div>
					</div>
				</div>

				<div class="mb-4 grid grid-cols-2 gap-3">
					<button
						class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-white py-3.5 text-base font-semibold text-black transition hover:opacity-85"
						onclick={downloadPng}
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
						onclick={copyData}
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
								><path d="m12 15 2 2 4-4" /><rect
									width="14"
									height="14"
									x="8"
									y="8"
									rx="2"
									ry="2"
								/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg
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

			<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
				<h2 class="mb-1 text-lg font-bold">Data preview</h2>
				<p class="mb-5 text-xs text-neutral-500">Raw data that will be encoded in the QR code</p>
				<div
					class="min-h-6 rounded-lg bg-neutral-800 px-4 py-3.5 font-mono text-sm break-all text-neutral-200"
				>
					{dataPreview}
				</div>
			</div>

			<a
				href="https://github.com/GautierPicon/QrCode-Generator"
				target="_blank"
				class="flex items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 transition hover:bg-neutral-800"
			>
				<img src={github} alt="GitHub" class="h-7 w-7" />
				<div>
					<p class="text-sm font-semibold text-white">Open source</p>
					<p class="text-xs text-neutral-400">Contribute on GitHub</p>
				</div>
			</a>
		</div>
	</div>
</div>
