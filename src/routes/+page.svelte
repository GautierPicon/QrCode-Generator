<script lang="ts">
	import QRCodeStyling from 'qr-code-styling';
	import { labels } from '$lib/types';
	import Header from '$lib/components/Header.svelte';
	import QRData from '$lib/components/QRData.svelte';
	import Customization from '$lib/components/Customization.svelte';
	import QRCodeDisplay from '$lib/components/QRCodeDisplay.svelte';
	import DataPreview from '$lib/components/DataPreview.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';

	let currentType = $state('text');
	let content = $state('Hello, world!');
	let wifiSsid = $state('');
	let wifiSecurity = $state('WPA');
	let wifiPassword = $state('');
	let contactFirstName = $state('');
	let contactLastName = $state('');
	let contactOrg = $state('');
	let contactPhone = $state('');
	let contactEmail = $state('');
	let contactWebsite = $state('');
	let size = $state(256);
	let margin = $state(4);
	let darkColor = $state('#000000');
	let lightColor = $state('#ffffff');
	let errorLevel = $state<'L' | 'M' | 'Q' | 'H'>('M');
	let logoUrl: string | undefined = $state();

	let qrContainer: HTMLDivElement | undefined = $state();
	let qrCode: QRCodeStyling | undefined = $state();
	let copied = $state(false);

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

	let dataPreview = $derived(buildData() || '—');

	$effect(() => {
		render();
	});

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
	<Header />

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
			<QRCodeDisplay bind:container={qrContainer} {copied} {downloadPng} {copyData} />
			<DataPreview {dataPreview} />
			<GitHubLink />
		</div>
	</div>
</div>
