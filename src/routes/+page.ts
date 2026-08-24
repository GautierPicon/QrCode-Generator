import type { PageLoad } from './$types';

export const load: PageLoad = ({ url }) => {
	const sp = url.searchParams;
	return {
		type: sp.get('type') || undefined,
		content: sp.get('content') || undefined,
		wifiSsid: sp.get('ssid') || undefined,
		wifiSecurity: sp.get('security') || undefined,
		wifiPassword: sp.get('password') || undefined,
		contactFirstName: sp.get('firstName') || undefined,
		contactLastName: sp.get('lastName') || undefined,
		contactOrg: sp.get('org') || undefined,
		contactPhone: sp.get('phone') || undefined,
		contactEmail: sp.get('email') || undefined,
		contactWebsite: sp.get('website') || undefined,
		size: sp.get('size') || undefined,
		margin: sp.get('margin') || undefined,
		darkColor: sp.get('darkColor') || undefined,
		lightColor: sp.get('lightColor') || undefined,
		errorLevel: sp.get('errorLevel') || undefined,
		dotStyle: sp.get('dots') || undefined,
		cornerSquareStyle: sp.get('cornerSquares') || undefined,
		cornerDotStyle: sp.get('cornerDots') || undefined,
		eyeColors: sp.get('eyeColors') || undefined,
		cornerSquareColor: sp.get('cornerSquareColor') || undefined,
		cornerDotColor: sp.get('cornerDotColor') || undefined,
		dotGradient: sp.get('dotGradient') || undefined,
		dotColor2: sp.get('dotColor2') || undefined,
		bgGradient: sp.get('bgGradient') || undefined,
		lightColor2: sp.get('lightColor2') || undefined
	};
};
