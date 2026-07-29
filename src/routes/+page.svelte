<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';

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

	const tabRows = [
		['text', 'url', 'email'],
		['phone', 'sms', 'wifi', 'contact']
	] as const;

let currentType: string = $state('text');
	let content = $state('Hello, world!');
	let size = $state(256);
	let margin = $state(4);
	let darkColor = $state('#000000');
	let lightColor = $state('#ffffff');
	let errorLevel = $state<'L' | 'M' | 'Q' | 'H'>('M');

	let canvasEl: HTMLCanvasElement | undefined = $state();
	let copyLabel = $state('Copy data');

	function buildData() {
		const val = content.trim();
		if (currentType === 'email') return val ? 'mailto:' + val : '';
		if (currentType === 'phone') return val ? 'tel:' + val : '';
		if (currentType === 'sms') return val ? 'sms:' + val : '';
		return val;
	}

	function selectTab(type: string) {
		currentType = type;
		content = '';
	}

	async function draw() {
		if (!canvasEl) return;
		const data = buildData();
		if (!data) {
			const ctx = canvasEl.getContext('2d');
			if (!ctx) return;
			canvasEl.width = size;
			canvasEl.height = size;
			ctx.clearRect(0, 0, size, size);
			return;
		}
		try {
			await QRCode.toCanvas(canvasEl, data, {
				width: size,
				margin,
				color: { dark: darkColor, light: lightColor },
				errorCorrectionLevel: errorLevel
			});
		} catch (e) {
			console.error(e);
		}
	}

	let currentConfig = $derived(labels[currentType]);
	let dataPreview = $derived(buildData() || '—');
	$effect(() => {
		draw();
	});

	onMount(draw);

	function downloadPng() {
		if (!canvasEl) return;
		const link = document.createElement('a');
		link.download = 'qrcode.png';
		link.href = canvasEl.toDataURL('image/png');
		link.click();
	}

	function copyData() {
		navigator.clipboard.writeText(buildData());
		copyLabel = 'Copied!';
		setTimeout(() => (copyLabel = 'Copy data'), 1200);
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
				<h2 class="mb-1 text-lg font-bold">QR Code Data</h2>
				<p class="mb-5 text-xs text-neutral-500">
					Choose data type and enter information to encode
				</p>

				<div class="mb-2 grid grid-cols-3 gap-2">
					{#each tabRows[0] as type (type)}
						<button
							class="rounded-lg border px-2 py-2.5 text-sm font-semibold transition
                {currentType === type
								? 'border-neutral-700 bg-neutral-800 text-white'
								: 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'}"
							onclick={() => selectTab(type)}
						>
							{type[0].toUpperCase() + type.slice(1)}
						</button>
					{/each}
				</div>
				<div class="mb-5 grid grid-cols-4 gap-2">
					{#each tabRows[1] as type (type)}
						<button
							class="rounded-lg border px-2 py-2.5 text-sm font-semibold transition
                {currentType === type
								? 'border-neutral-700 bg-neutral-800 text-white'
								: 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200'}"
							onclick={() => selectTab(type)}
						>
							{type[0].toUpperCase() + type.slice(1)}
						</button>
					{/each}
				</div>

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
						class="w-full accent-white"
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
						class="w-full accent-white"
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
				<select
					id="error-level"
					bind:value={errorLevel}
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
				>
					<option value="L">Low (7%)</option>
					<option value="M">Medium (15%)</option>
					<option value="Q">Quartile (25%)</option>
					<option value="H">High (30%)</option>
				</select>
			</div>
		</div>

		<!-- Colonne droite -->
		<div class="flex flex-col gap-5">
			<div class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
				<h2 class="mb-1 text-lg font-bold">Generated QR code</h2>
				<p class="mb-5 text-xs text-neutral-500">Your QR code will appear here automatically</p>

				<div class="flex justify-center py-7">
					<div class="inline-flex rounded-2xl bg-white p-5">
						<canvas bind:this={canvasEl}></canvas>
					</div>
				</div>

				<div class="mb-4 grid grid-cols-2 gap-3">
					<button
						class="rounded-lg bg-white py-3 text-sm font-semibold text-black transition hover:opacity-85"
						onclick={downloadPng}
					>
						&#8681; Download PNG
					</button>
					<button
						class="rounded-lg border border-neutral-700 bg-transparent py-3 text-sm font-semibold text-white transition hover:opacity-85"
						onclick={copyData}
					>
						{copyLabel}
					</button>
				</div>

				<div
					class="rounded-lg border border-neutral-800 bg-neutral-800/60 px-4 py-3.5 text-xs leading-relaxed text-neutral-400"
				>
					QR code updates automatically as you type. Higher error correction levels make codes more
					robust but larger.
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
		</div>
	</div>
</div>
