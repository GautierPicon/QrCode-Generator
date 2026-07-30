export type Label = { label: string; placeholder: string };

export const labels: Record<string, Label> = {
	text: { label: 'Text content', placeholder: 'Hello, world!' },
	url: { label: 'URL', placeholder: 'https://example.com' },
	email: { label: 'Email address', placeholder: 'name@example.com' },
	phone: { label: 'Phone number', placeholder: '+1 555 123 4567' },
	sms: { label: 'SMS number', placeholder: '+1 555 123 4567' },
	wifi: { label: 'WiFi (SSID:Password)', placeholder: 'MyNetwork:mypassword' },
	contact: { label: 'Contact info', placeholder: 'John Doe, +1 555 123 4567' }
};

export const types = ['text', 'url', 'email', 'phone', 'sms', 'wifi', 'contact'] as const;
