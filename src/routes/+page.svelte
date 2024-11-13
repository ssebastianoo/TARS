<script lang="ts">
	import { SpeechRecognition } from '@capacitor-community/speech-recognition';
	import { TextToSpeech } from '@capacitor-community/text-to-speech';
	import { Ollama } from 'ollama';
	import { onMount } from 'svelte';
	import { Page, Button } from 'konsta/svelte';
	import { Mic } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import { PUBLIC_OLLAMA_API } from '$env/static/public';

	const ollama = new Ollama({ host: PUBLIC_OLLAMA_API });

	let messages = $state<{ role: string; content: string }[]>([]);
	let result = $state<string>('');
	let spoke = $state<null | string>(null);
	let listening = $state(false);

	onMount(async () => {
		const permissions = await SpeechRecognition.checkPermissions();
		if ((permissions.speechRecognition as string) !== 'granted') {
			await SpeechRecognition.requestPermissions();
		}

		await SpeechRecognition.addListener('listeningState', async (data) => {
			if (data.status === 'stopped') {
				setTimeout(async () => {
					listening = false;
					if (spoke) {
						console.log('ollama will receive: ' + spoke);
						messages.push({ role: 'user', content: spoke });
						const response = await ollama.chat({
							model: 'tars',
							messages,
							stream: true
						});
						for await (const part of response) {
							result += part.message.content;
						}
						spoke = null;
						if (result) {
							messages.push({ role: 'assistant', content: result });
							await TextToSpeech.speak({
								text: result,
								lang: 'it-IT',
								rate: 1.0,
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
			console.log(data);
			spoke = data.matches[0];
		});
	});

	async function listen() {
		await TextToSpeech.stop();
		result = '';
		listening = true;
		await SpeechRecognition.start({
			popup: false,
			language: 'it-IT',
			partialResults: true
		});
	}
</script>

<Page>
	<div class="flex h-1/2 items-center justify-center p-4">
		<div
			class="m-4 overflow-auto rounded-2xl bg-md-light-surface-1 text-md-light-on-surface dark:bg-md-dark-surface-1 dark:text-md-dark-on-surface"
		>
			{#if listening && !spoke}
				<p>Listening...</p>
			{:else if spoke}
				<p>{spoke}</p>
			{:else if !listening && result != ''}
				<p class="p-4 text-sm">
					{result}
				</p>
			{/if}
		</div>
	</div>
	<div class="flex h-1/2 flex-col items-center justify-center gap-[50px]">
		<Button onclick={listen} class={cn('h-18 !w-18 !rounded-full', listening ? 'animate-grow' : '')}
			><Mic /></Button
		>
	</div>
</Page>
