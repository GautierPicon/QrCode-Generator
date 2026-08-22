<script lang="ts">
	import { labels, types } from '$lib/types';

	let {
		currentType = $bindable('text'),
		content = $bindable(''),
		wifiSsid = $bindable(''),
		wifiSecurity = $bindable('WPA'),
		wifiPassword = $bindable(''),
		contactFirstName = $bindable(''),
		contactLastName = $bindable(''),
		contactOrg = $bindable(''),
		contactPhone = $bindable(''),
		contactEmail = $bindable(''),
		contactWebsite = $bindable('')
	} = $props();

	let currentConfig = $derived(labels[currentType]);
</script>

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
			/><rect width="5" height="5" x="3" y="16" rx="1" /><path d="M21 16h-3a2 2 0 0 0-2 2v3" /><path
				d="M21 21v.01"
			/><path d="M12 7v3a2 2 0 0 1-2 2H7" /><path d="M3 12h.01" /><path d="M12 3h.01" /><path
				d="M12 16v.01"
			/><path d="M16 12h1" /><path d="M21 12v.01" /><path d="M12 21v-1" /></svg
		>
		QR Code Data
	</h2>
	<p class="mb-5 text-xs text-neutral-500">Choose data type and enter information to encode</p>

	<select
		bind:value={currentType}
		class="mb-5 w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
	>
		{#each types as type (type)}
			<option value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
		{/each}
	</select>

	{#if currentType === 'wifi'}
		<div class="space-y-4">
			<div>
				<label class="mb-2 block text-sm font-semibold" for="wifi-ssid">Network Name (SSID)</label>
				<input
					id="wifi-ssid"
					type="text"
					bind:value={wifiSsid}
					placeholder="MyWiFi"
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="wifi-security">Security</label>
				<select
					id="wifi-security"
					bind:value={wifiSecurity}
					class="w-full cursor-pointer rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none"
				>
					<option value="WPA">WPA/WPA2</option>
					<option value="WEP">WEP</option>
					<option value="nopass">None</option>
				</select>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="wifi-password">Password</label>
				<input
					id="wifi-password"
					type="password"
					bind:value={wifiPassword}
					placeholder="password123"
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
		</div>
	{:else if currentType === 'contact'}
		<div class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label class="mb-2 block text-sm font-semibold" for="contact-first">First Name</label>
					<input
						id="contact-first"
						type="text"
						bind:value={contactFirstName}
						placeholder="John"
						class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
					/>
				</div>
				<div>
					<label class="mb-2 block text-sm font-semibold" for="contact-last">Last Name</label>
					<input
						id="contact-last"
						type="text"
						bind:value={contactLastName}
						placeholder="Doe"
						class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
					/>
				</div>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="contact-org">Organization</label>
				<input
					id="contact-org"
					type="text"
					bind:value={contactOrg}
					placeholder="Company Inc."
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="contact-phone">Phone</label>
				<input
					id="contact-phone"
					type="tel"
					bind:value={contactPhone}
					placeholder="+1234567890"
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="contact-email">Email</label>
				<input
					id="contact-email"
					type="email"
					bind:value={contactEmail}
					placeholder="john.doe@company.com"
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
			<div>
				<label class="mb-2 block text-sm font-semibold" for="contact-website">Website</label>
				<input
					id="contact-website"
					type="url"
					bind:value={contactWebsite}
					placeholder="https://company.com"
					class="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
				/>
			</div>
		</div>
	{:else}
		<label class="mb-2 block text-sm font-semibold" for="content-input">
			{currentConfig.label}
		</label>
		<textarea
			id="content-input"
			bind:value={content}
			placeholder={currentConfig.placeholder}
			class="min-h-35 w-full resize-y rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 text-sm text-white outline-none focus:border-neutral-600"
		></textarea>
	{/if}
</div>
