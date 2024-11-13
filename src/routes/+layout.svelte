<script lang="ts">
	import '../app.css';
	import '@fontsource/roboto';
	import { App } from 'konsta/svelte';

	let { children } = $props();
</script>

<App dark={true}>
	{@render children()}
</App>
