<script lang="ts">
	import QRCodeStyling from 'qr-code-styling';
	import { labels } from '$lib/types';
	import QRData from '$lib/components/QRData.svelte';
	import Customization from '$lib/components/Customization.svelte';
	import QRCodeDisplay from '$lib/components/QRCodeDisplay.svelte';
	import DataPreview from '$lib/components/DataPreview.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let currentType = $state(data.type ?? 'text');
	// svelte-ignore state_referenced_locally
	let content = $state(data.content ?? 'Hello, world!');
	// svelte-ignore state_referenced_locally
	let wifiSsid = $state(data.wifiSsid ?? '');
	// svelte-ignore state_referenced_locally
	let wifiSecurity = $state(data.wifiSecurity ?? 'WPA');
	// svelte-ignore state_referenced_locally
	let wifiPassword = $state(data.wifiPassword ?? '');
	// svelte-ignore state_referenced_locally
	let contactFirstName = $state(data.contactFirstName ?? '');
	// svelte-ignore state_referenced_locally
	let contactLastName = $state(data.contactLastName ?? '');
	// svelte-ignore state_referenced_locally
	let contactOrg = $state(data.contactOrg ?? '');
	// svelte-ignore state_referenced_locally
	let contactPhone = $state(data.contactPhone ?? '');
	// svelte-ignore state_referenced_locally
	let contactEmail = $state(data.contactEmail ?? '');
	// svelte-ignore state_referenced_locally
	let contactWebsite = $state(data.contactWebsite ?? '');
	// svelte-ignore state_referenced_locally
	let size = $state(data.size ? Number(data.size) : 256);
	// svelte-ignore state_referenced_locally
	let margin = $state(data.margin !== undefined ? Number(data.margin) : 1);
	// svelte-ignore state_referenced_locally
	let darkColor = $state(data.darkColor ?? '#000000');
	// svelte-ignore state_referenced_locally
	let lightColor = $state(data.lightColor ?? '#ffffff');
	// svelte-ignore state_referenced_locally
	let errorLevel = $state<'L' | 'M' | 'Q' | 'H'>((data.errorLevel as 'L' | 'M' | 'Q' | 'H') ?? 'M');
	let logoUrl: string | undefined = $state();

	let qrContainer: HTMLDivElement | undefined = $state();
	let qrCode: QRCodeStyling | undefined = $state();
	let urlCopied = $state(false);

	function buildData() {
		if (currentType === 'wifi') {
			const ssid = wifiSsid.trim() || 'MyWiFi';
			if (wifiSecurity === 'nopass') {
				return `WIFI:T:nopass;S:${ssid};;`;
			}
			const password = wifiPassword || 'password123';
			return `WIFI:T:${wifiSecurity};S:${ssid};P:${password};;`;
		}
		if (currentType === 'contact') {
			const parts = ['BEGIN:VCARD', 'VERSION:3.0'];
			const fullName = [contactFirstName.trim(), contactLastName.trim()].filter(Boolean).join(' ');
			if (fullName) {
				parts.push(`FN:${fullName}`);
			} else {
				parts.push('FN:John Doe');
			}
			if (contactOrg.trim()) {
				parts.push(`ORG:${contactOrg.trim()}`);
			} else {
				parts.push('ORG:Company Inc.');
			}
			if (contactPhone.trim()) {
				parts.push(`TEL:${contactPhone.trim()}`);
			} else {
				parts.push('TEL:+1234567890');
			}
			if (contactEmail.trim()) {
				parts.push(`EMAIL:${contactEmail.trim()}`);
			} else {
				parts.push('EMAIL:john.doe@company.com');
			}
			if (contactWebsite.trim()) {
				parts.push(`URL:${contactWebsite.trim()}`);
			} else {
				parts.push('URL:https://company.com');
			}
			parts.push('END:VCARD');
			return parts.join('\n');
		}
		const prefix =
			currentType === 'email'
				? 'mailto:'
				: currentType === 'phone'
					? 'tel:'
					: currentType === 'sms'
						? 'sms:'
						: '';
		const val = content.trim();
		if (!val) return prefix + labels[currentType].placeholder;
		return prefix + val;
	}

	function render() {
		if (!qrContainer) return;
		const data = buildData();
		if (!data) return;
		const options = {
			width: size,
			height: size,
			data,
			margin: margin * 4,
			type: 'canvas' as const,
			qrOptions: { errorCorrectionLevel: errorLevel },
			dotsOptions: { color: darkColor, type: 'square' as const, roundSize: false },
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

	let dataPreview = $derived(buildData() || '—');

	$effect(() => {
		render();
	});

	function download(extension: 'png' | 'webp' | 'jpeg' | 'svg') {
		qrCode?.download({ name: 'qrcode', extension });
	}

	function copyUrl() {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const params = new URLSearchParams();
		params.set('type', currentType);
		if (currentType === 'wifi') {
			if (wifiSsid) params.set('ssid', wifiSsid);
			if (wifiSecurity !== 'WPA') params.set('security', wifiSecurity);
			if (wifiPassword) params.set('password', wifiPassword);
		} else if (currentType === 'contact') {
			if (contactFirstName.trim()) params.set('firstName', contactFirstName.trim());
			if (contactLastName.trim()) params.set('lastName', contactLastName.trim());
			if (contactOrg.trim()) params.set('org', contactOrg.trim());
			if (contactPhone.trim()) params.set('phone', contactPhone.trim());
			if (contactEmail.trim()) params.set('email', contactEmail.trim());
			if (contactWebsite.trim()) params.set('website', contactWebsite.trim());
		} else {
			if (content.trim()) params.set('content', content.trim());
		}
		params.set('size', String(size));
		if (margin !== 1) params.set('margin', String(margin));
		if (darkColor !== '#000000') params.set('darkColor', darkColor);
		if (lightColor !== '#ffffff') params.set('lightColor', lightColor);
		if (errorLevel !== 'M') params.set('errorLevel', errorLevel);
		const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
		navigator.clipboard
			.writeText(url)
			.then(() => {
				urlCopied = true;
				setTimeout(() => (urlCopied = false), 1200);
			})
			.catch(() => {});
	}
</script>

<svelte:head>
	<title>QR Code Generator</title>
</svelte:head>

<div class="min-h-screen bg-neutral-950 pt-12 text-white">
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 pb-12 md:grid-cols-2">
		<div class="flex flex-col gap-5">
			<QRData
				bind:currentType
				bind:content
				bind:wifiSsid
				bind:wifiSecurity
				bind:wifiPassword
				bind:contactFirstName
				bind:contactLastName
				bind:contactOrg
				bind:contactPhone
				bind:contactEmail
				bind:contactWebsite
			/>
			<Customization
				bind:size
				bind:margin
				bind:darkColor
				bind:lightColor
				bind:errorLevel
				bind:logoUrl
			/>
		</div>

		<div class="flex flex-col gap-5">
			<QRCodeDisplay bind:container={qrContainer} {urlCopied} {download} {copyUrl} />
			<DataPreview {dataPreview} />
			<GitHubLink />
		</div>
	</div>
</div>
