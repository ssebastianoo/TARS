<script lang="ts">
	import { SpeechRecognition } from '@capacitor-community/speech-recognition';
	import { TextToSpeech } from '@capacitor-community/text-to-speech';
	import { Ollama } from 'ollama';
	import { onMount } from 'svelte';
	import { Page, Button } from 'konsta/svelte';
	import { Mic } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { PUBLIC_OLLAMA_API } from '$env/static/public';
	import { Haptics, ImpactStyle } from '@capacitor/haptics';
	import { Preferences } from '@capacitor/preferences';
	import defaultConfig from '$lib/defaultConfig';

	let messages = $state<{ role: string; content: string }[]>([]);
	let result = $state<string>('');
	let spoke = $state<null | string>(null);
	let listening = $state(false);
	let loading = $state(false);

	onMount(async () => {
		const ollamaApi =
			(await Preferences.get({ key: 'ollamaApi' })).value || defaultConfig.ollamaApi.value;

		let speed: number;
		if ((await Preferences.get({ key: 'speed' })).value) {
			speed = parseFloat((await Preferences.get({ key: 'speed' })).value!);
		} else speed = defaultConfig.speed.value;

		console.log(ollamaApi);
		console.log(speed);

		const ollama = new Ollama({ host: ollamaApi });

		const permissions = await SpeechRecognition.checkPermissions();
		if ((permissions.speechRecognition as string) !== 'granted') {
			await SpeechRecognition.requestPermissions();
		}

		await SpeechRecognition.addListener('listeningState', async (data) => {
			if (data.status === 'stopped') {
				setTimeout(async () => {
					listening = false;
					if (spoke) {
						loading = true;
						messages.push({ role: 'user', content: spoke });
						const response = await ollama.chat({
							model: 'tars',
							messages,
							stream: true
						});
						for await (const part of response) {
							result += part.message.content;
						}
						loading = false;
						spoke = null;
						if (result) {
							messages.push({ role: 'assistant', content: result });
							await TextToSpeech.speak({
								text: result,
								lang: 'it-IT',
								rate: speed,
								pitch: 1.0,
								volume: 1.0,
								category: 'ambient'
							});
						}
					} else {
						result = 'Non ho capito.';
					}
				}, 1000);
			}
		});
		await SpeechRecognition.addListener('partialResults', (data) => {
			spoke = data.matches[0];
		});
	});

	async function listen() {
		await Haptics.impact({ style: ImpactStyle.Heavy });

		await TextToSpeech.stop();
		if (listening) {
			listening = false;
			await SpeechRecognition.stop();
		} else {
			result = '';
			listening = true;
			await SpeechRecognition.start({
				popup: false,
				language: 'it-IT',
				partialResults: true
			});
		}
	}
</script>

<div class="flex h-2/3 items-center justify-center">
	<div
		class="m-4 max-h-full overflow-auto rounded-2xl bg-md-light-surface-1 text-md-light-on-surface dark:bg-md-dark-surface-1 dark:text-md-dark-on-surface"
	>
		{#if listening && !spoke}
			<p class="p-4 text-sm">Listening...</p>
		{:else if spoke}
			<p class="p-4 text-sm">
				{spoke}
			</p>
		{:else if !listening && result != ''}
			<p class="p-4 text-sm">
				{result}
			</p>
		{/if}
	</div>
</div>
<div class="flex h-1/3 flex-col items-center justify-center gap-[50px]">
	{#if loading}
		<div
			class="h-18 w-18 animate-spin rounded-full border-4 border-md-dark-primary-container border-b-md-dark-primary"
		></div>
	{:else}
		<div
			class={cn(
				'absolute h-18 w-18 rounded-full bg-md-dark-surface-5',
				listening ? 'animate-grow' : ''
			)}
		></div>
		<Button onclick={listen} class={cn('h-18 !w-18 !rounded-full')}><Mic /></Button>
	{/if}
</div>
