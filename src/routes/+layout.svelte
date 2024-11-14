<script lang="ts">
	import '../app.css';
	import '@fontsource/roboto';
	import { App, Page, Panel } from 'konsta/svelte';
	import { Settings, Menu, Github } from 'lucide-svelte';

	let { children } = $props();

	let open = $state(false);
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
			<Page class="p-4">
				<div>
					<a href="/settings" class="flex items-center gap-2">
						<Settings size={20} class="text-md-dark-primary" />
						<span>Settings</span>
					</a>
					<a href="https://github.com/ssebastianoo/TARS" class="flex items-center gap-2">
						<Github size={20} class="text-md-dark-primary" />
						<span>Source</span>
					</a>
				</div>
			</Page>
		</Panel>
	</Page>
</App>
