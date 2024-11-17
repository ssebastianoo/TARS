<script lang="ts">
	import '../app.css';
	import '@fontsource/roboto';
	import { StatusBar, Style } from '@capacitor/status-bar';
	import { NavigationBar } from '@capgo/capacitor-navigation-bar';
	import { App, Page, Panel, Link } from 'konsta/svelte';
	import { Settings, Menu, Github, Home } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	let { children } = $props();
	let open = $state(false);

	onMount(async () => {
		await StatusBar.setStyle({ style: Style.Dark });
		await StatusBar.setBackgroundColor({
			color: '#201a17'
		});
		await NavigationBar.setNavigationBarColor({
			color: '#201a17'
		});
	});
</script>

<App dark={true}>
	<Page class="p-4">
		<div class="h-8">
			<button onclick={() => (open = true)}><Menu class="text-md-dark-primary" /></button>
		</div>
		<div class="h-[calc(100%-2rem)]">
			{@render children()}
		</div>
		<Panel side="left" opened={open} onBackdropClick={() => (open = false)}>
			<Page class="flex flex-col justify-center p-4">
				<Link
					class={cn(
						'!justify-start gap-1 rounded-lg p-3',
						$page.url.pathname === '/' && 'bg-md-dark-surface-2'
					)}
					href="/"
					onclick={() => (open = false)}
				>
					<Home />
					<span>Home</span>
				</Link>
				<Link
					class={cn(
						'!justify-start gap-1 rounded-lg p-3',
						$page.url.pathname === '/settings' && 'bg-md-dark-surface-2'
					)}
					href="/settings"
					onclick={() => (open = false)}
				>
					<Settings />
					<span>Settings</span>
				</Link>
				<Link
					class="!justify-start gap-1 rounded-lg p-3"
					href="https://github.com/ssebastianoo/TARS"
					onclick={() => (open = false)}
				>
					<Github />
					<span>GitHub</span>
				</Link>
			</Page>
		</Panel>
	</Page>
</App>
