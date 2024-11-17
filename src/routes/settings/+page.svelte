<script lang="ts">
	import { Preferences } from '@capacitor/preferences';
	import { onMount } from 'svelte';
	import defaultConfig from '$lib/defaultConfig';
	import { TextToSpeech } from '@capacitor-community/text-to-speech';
	import type { SpeechSynthesisVoice } from '@capacitor-community/text-to-speech';

	let settings = $state(defaultConfig);
	let voices = $state<SpeechSynthesisVoice[]>([]);

	onMount(async () => {
		const config = await Preferences.keys();
		voices = (await TextToSpeech.getSupportedVoices()).voices;

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
			{#if key == 'voice'}
				<select
					id={key}
					class="rounded-lg border border-md-dark-surface-1 bg-md-dark-surface-2 p-2 !outline-none focus:border-md-dark-primary"
					onchange={(e) => updateSettings(key, e.target as HTMLInputElement)}
				>
					{#each voices as voice, index}
						<option selected={index === parseInt(option.value as string)} value={index}
							>{voice.voiceURI}</option
						>
					{/each}
				</select>
			{:else}
				<input
					id={key}
					class="rounded-lg border border-md-dark-surface-1 bg-md-dark-surface-2 p-2 !outline-none focus:border-md-dark-primary"
					type={option.type === 'float' ? 'number' : 'text'}
					value={option.value}
					step="0.1"
					onchange={(e) => updateSettings(key, e.target as HTMLInputElement)}
				/>
			{/if}
		</div>
	{/each}
</div>
