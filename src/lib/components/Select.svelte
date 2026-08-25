<script lang="ts" generics="T extends string">
	import { ChevronDown } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	let {
		id,
		value = $bindable('' as T),
		disabled = false,
		onchange,
		class: className = '',
		children
	}: {
		id?: string;
		value?: T;
		disabled?: boolean;
		onchange?: () => void;
		class?: string;
		children: Snippet;
	} = $props();
</script>

<div class={`relative ${className}`}>
	<select
		{id}
		bind:value
		{disabled}
		{onchange}
		class="w-full cursor-pointer appearance-none rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-3 pr-10 text-sm text-white outline-none disabled:opacity-50"
	>
		{@render children()}
	</select>
	<span class="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-neutral-400">
		<ChevronDown size={16} />
	</span>
</div>
