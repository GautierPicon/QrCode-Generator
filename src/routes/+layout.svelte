<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { browser } from '$app/environment';
	import { displayConsoleArt } from '../scripts/ConsoleArt';

	let { children } = $props();

	if (browser) displayConsoleArt();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
