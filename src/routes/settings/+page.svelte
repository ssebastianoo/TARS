<script lang="ts">
	import { Preferences } from '@capacitor/preferences';
	import { onMount } from 'svelte';
	import defaultConfig from '$lib/defaultConfig';

	let settings = $state<{
		[key: string]: {
			value: string | number;
			type: string;
		};
	}>(defaultConfig);

	onMount(async () => {
		const config = await Preferences.keys();

		for (const key of config.keys) {
			const { value } = await Preferences.get({ key });
			if (value) settings[key].value = value;
		}
	});

	async function updateSettings(key: string, target: HTMLInputElement) {
		await Preferences.set({ key, value: target.value.toString() });
	}
</script>

<div class="flex h-full flex-col justify-center gap-3">
	{#each Object.entries(settings) as [key, option]}
		<div class="flex flex-col gap-2">
			<label for={key} class="text-md-dark-on-surface">{key}</label>
			<input
				id={key}
				class="rounded-lg border border-md-dark-surface-1 bg-md-dark-surface-2 p-2 !outline-none focus:border-md-dark-primary"
				type={option.type === 'float' ? 'number' : 'text'}
				value={option.value}
				step="0.1"
				onchange={(e) => updateSettings(key, e.target as HTMLInputElement)}
			/>
		</div>
	{/each}
</div>
