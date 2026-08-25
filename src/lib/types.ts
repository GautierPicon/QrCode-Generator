export type Label = { label: string; placeholder: string };

export const labels: Record<string, Label> = {
	text: { label: 'Text content', placeholder: 'Hello, world!' },
	url: { label: 'URL', placeholder: 'https://example.com' },
	email: { label: 'Email address', placeholder: 'name@example.com' },
	phone: { label: 'Phone number', placeholder: '+1 555 123 4567' },
	sms: { label: 'SMS number', placeholder: '+1 555 123 4567' },
	wifi: { label: 'WiFi network', placeholder: '' },
	contact: { label: 'Contact info', placeholder: '' }
};

export const types = ['text', 'url', 'email', 'phone', 'sms', 'wifi', 'contact'] as const;

export const dotStyles = [
	'square',
	'rounded',
	'dots',
	'classy',
	'classy-rounded',
	'extra-rounded'
] as const;
export type DotStyle = (typeof dotStyles)[number];

export const cornerSquareStyles = ['square', 'dot', 'extra-rounded'] as const;
export type CornerSquareStyle = (typeof cornerSquareStyles)[number];

export const cornerDotStyles = ['square', 'dot'] as const;
export type CornerDotStyle = (typeof cornerDotStyles)[number];

export const gradientTypes = ['none', 'linear', 'radial'] as const;
export type GradientType = (typeof gradientTypes)[number];

export const dotStyleLabels: Record<DotStyle, string> = {
	square: 'Square',
	rounded: 'Rounded',
	dots: 'Dots',
	classy: 'Classy',
	'classy-rounded': 'Classy Rounded',
	'extra-rounded': 'Extra Rounded'
};

export const cornerSquareStyleLabels: Record<CornerSquareStyle, string> = {
	square: 'Square',
	dot: 'Dot',
	'extra-rounded': 'Extra Rounded'
};

export const cornerDotStyleLabels: Record<CornerDotStyle, string> = {
	square: 'Square',
	dot: 'Dot'
};

export const gradientLabels: Record<GradientType, string> = {
	none: 'None',
	linear: 'Linear',
	radial: 'Radial'
};
