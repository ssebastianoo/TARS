<script lang="ts">
	import { SpeechRecognition } from '@capacitor-community/speech-recognition';
	import { TextToSpeech } from '@capacitor-community/text-to-speech';
	import { Ollama } from 'ollama/browser';
	import { onMount } from 'svelte';
	import { Button } from 'konsta/svelte';
	import { Mic } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { Haptics, ImpactStyle } from '@capacitor/haptics';
	import { Preferences } from '@capacitor/preferences';
	import defaultConfig from '$lib/defaultConfig';

	let messages = $state<{ role: string; content: string }[]>([]);
	let result = $state<string>('');
	let spoke = $state<null | string>(null);
	let listening = $state(false);
	let loading = $state(false);

	onMount(() => {
		async function om() {
			const ollamaApi =
				(await Preferences.get({ key: 'ollamaApi' })).value || defaultConfig.ollamaApi.value;

			let speed: number;
			if ((await Preferences.get({ key: 'speed' })).value) {
				speed = parseFloat((await Preferences.get({ key: 'speed' })).value!);
			} else speed = defaultConfig.speed.value as number;

			let voice: number;
			if ((await Preferences.get({ key: 'voice' })).value) {
				voice = parseInt((await Preferences.get({ key: 'voice' })).value!);
			} else voice = defaultConfig.voice.value as number;

			const ollama = new Ollama({ host: ollamaApi as string });

			const permissions = await SpeechRecognition.checkPermissions();
			if ((permissions.speechRecognition as string) !== 'granted') {
				await SpeechRecognition.requestPermissions();
			}

			await SpeechRecognition.addListener('listeningState', async (data) => {
				console.log('new status:', data.status);
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
							let toSpeak = '';
							for await (const part of response) {
								result += part.message.content;
								toSpeak += part.message.content;

								for (const char of ['.', '?', '!', ',']) {
									if (toSpeak.includes(char)) {
										const textToSpeak = toSpeak.split(char)[0] + char;
										toSpeak = toSpeak.split(char)[1];
										TextToSpeech.speak({
											text: textToSpeak,
											lang: 'it-IT',
											rate: speed,
											pitch: 1.0,
											volume: 1.0,
											category: 'ambient',
											voice,
											queueStrategy: 1
										});
									}
								}
							}
							if (toSpeak != '') {
								TextToSpeech.speak({
									text: toSpeak,
									lang: 'it-IT',
									rate: speed,
									pitch: 1.0,
									volume: 1.0,
									category: 'ambient',
									voice,
									queueStrategy: 1
								});
							}
							loading = false;
							spoke = null;
							if (result) {
								messages.push({ role: 'assistant', content: result });
								// await TextToSpeech.speak({
								// 	text: result,
								// 	lang: 'it-IT',
								// 	rate: speed,
								// 	pitch: 1.0,
								// 	volume: 1.0,
								// 	category: 'ambient',
								// 	voice
								// });
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
		}
		om();

		return () => {
			SpeechRecognition.stop();
			SpeechRecognition.removeAllListeners();
		};
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
	{#if listening}
		<p>Listening...</p>
	{:else if !listening && result != ''}
		<div
			class="m-4 max-h-full overflow-auto rounded-2xl bg-md-light-surface-1 text-md-light-on-surface dark:bg-md-dark-surface-1 dark:text-md-dark-on-surface"
		>
			<p class="p-4 text-sm">
				{result}
			</p>
		</div>
	{:else if loading}
		<p>Thinking really hard about that</p>
	{:else}
		<p>Got something to say?</p>
	{/if}
</div>
<div class="flex h-1/3 flex-col items-center justify-center gap-[50px]">
	{#if loading}
		<div
			class="h-18 w-18 animate-spin rounded-full border-4 border-md-dark-primary-container border-b-md-dark-primary"
		></div>
	{:else}
		<div class="absolute h-0 w-full -translate-y-13">
			<p class="absolute bottom-0 left-1/2 -translate-x-1/2 text-center text-sm">
				{spoke}
			</p>
		</div>
		<div
			class={cn(
				'absolute h-18 w-18 rounded-full bg-md-dark-surface-5',
				listening ? 'animate-grow' : ''
			)}
		></div>
		<Button onclick={listen} class={cn('h-18 !w-18 !rounded-full')}><Mic /></Button>
	{/if}
</div>
