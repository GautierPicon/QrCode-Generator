<script lang="ts">
	import QRCodeStyling from 'qr-code-styling';
	import {
		labels,
		type CornerDotStyle,
		type CornerSquareStyle,
		type DotStyle,
		type GradientType
	} from '$lib/types';
	import QRData from '$lib/components/QRData.svelte';
	import Customization from '$lib/components/Customization.svelte';
	import QRCodeDisplay from '$lib/components/QRCodeDisplay.svelte';
	import GitHubLink from '$lib/components/GitHubLink.svelte';

	let { data } = $props();

	// svelte-ignore state_referenced_locally
	let currentType = $state(data.type ?? 'text');
	// svelte-ignore state_referenced_locally
	let content = $state(data.content ?? '');
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
	// svelte-ignore state_referenced_locally
	let dotStyle = $state((data.dotStyle as DotStyle) ?? 'square');
	// svelte-ignore state_referenced_locally
	let cornerSquareStyle = $state((data.cornerSquareStyle as CornerSquareStyle) ?? 'square');
	// svelte-ignore state_referenced_locally
	let cornerDotStyle = $state((data.cornerDotStyle as CornerDotStyle) ?? 'square');
	// svelte-ignore state_referenced_locally
	let customEyeColors = $state(!!data.eyeColors);
	// svelte-ignore state_referenced_locally
	let cornerSquareColor = $state(data.cornerSquareColor ?? '');
	// svelte-ignore state_referenced_locally
	let cornerDotColor = $state(data.cornerDotColor ?? '');
	// svelte-ignore state_referenced_locally
	let dotGradient = $state<GradientType>((data.dotGradient as GradientType) ?? 'none');
	// svelte-ignore state_referenced_locally
	let dotColor2 = $state(data.dotColor2 ?? '');
	// svelte-ignore state_referenced_locally
	let bgGradient = $state<GradientType>((data.bgGradient as GradientType) ?? 'none');
	// svelte-ignore state_referenced_locally
	let lightColor2 = $state(data.lightColor2 ?? '');
	let logoUrl: string | undefined = $state();

	// svelte-ignore state_referenced_locally
	let previousType = currentType;
	$effect(() => {
		if (currentType === previousType) return;
		if (!content.trim() || content.trim() === labels[previousType].placeholder) {
			content = '';
		}
		previousType = currentType;
	});

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

	function makeGradient(type: Exclude<GradientType, 'none'>, from: string, to: string) {
		return {
			type,
			rotation: Math.PI / 4,
			colorStops: [
				{ offset: 0, color: from },
				{ offset: 1, color: to }
			]
		};
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
			dotsOptions: {
				color: darkColor,
				type: dotStyle,
				roundSize: false as const,
				gradient:
					dotGradient === 'none'
						? undefined
						: makeGradient(dotGradient, darkColor, dotColor2 || darkColor)
			},
			cornersSquareOptions: {
				type: cornerSquareStyle,
				color: customEyeColors ? cornerSquareColor || darkColor : darkColor
			},
			cornersDotOptions: {
				type: cornerDotStyle,
				color: customEyeColors ? cornerDotColor || darkColor : darkColor
			},
			backgroundOptions: {
				color: lightColor,
				gradient:
					bgGradient === 'none'
						? undefined
						: makeGradient(bgGradient, lightColor, lightColor2 || lightColor)
			},
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
		if (dotStyle !== 'square') params.set('dots', dotStyle);
		if (cornerSquareStyle !== 'square') params.set('cornerSquares', cornerSquareStyle);
		if (cornerDotStyle !== 'square') params.set('cornerDots', cornerDotStyle);
		if (customEyeColors) {
			params.set('eyeColors', '1');
			if (cornerSquareColor) params.set('cornerSquareColor', cornerSquareColor);
			if (cornerDotColor) params.set('cornerDotColor', cornerDotColor);
		}
		if (dotGradient !== 'none') {
			params.set('dotGradient', dotGradient);
			if (dotColor2) params.set('dotColor2', dotColor2);
		}
		if (bgGradient !== 'none') {
			params.set('bgGradient', bgGradient);
			if (lightColor2) params.set('lightColor2', lightColor2);
		}
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

<div class="min-h-screen bg-neutral-950 pt-12 text-white">
	<div class="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-6 pb-12 md:grid-cols-2">
		<div class="flex flex-col gap-5">
			<QRCodeDisplay bind:container={qrContainer} {urlCopied} {download} {copyUrl} />
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
				{dataPreview}
			/>
		</div>

		<div class="flex flex-col gap-5">
			<Customization
				bind:size
				bind:margin
				bind:darkColor
				bind:lightColor
				bind:errorLevel
				bind:logoUrl
				bind:dotStyle
				bind:cornerSquareStyle
				bind:cornerDotStyle
				bind:customEyeColors
				bind:cornerSquareColor
				bind:cornerDotColor
				bind:dotGradient
				bind:dotColor2
				bind:bgGradient
				bind:lightColor2
			/>
			<GitHubLink />
		</div>
	</div>
</div>
