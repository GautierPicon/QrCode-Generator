<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { displayConsoleArt } from '$lib/ConsoleArt';

	let { children } = $props();

	displayConsoleArt();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
