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
		contactWebsite: sp.get('website') || undefined
	};
};
