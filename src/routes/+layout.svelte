<script lang="ts">
	import './layout.css';
	import { browser } from '$app/environment';
	import { displayConsoleArt } from '../scripts/ConsoleArt';

	let { children } = $props();

	if (browser) displayConsoleArt();
</script>

{@render children()}
