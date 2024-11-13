import { Ollama } from 'ollama';

const ollama = new Ollama({ host: process.env.PUBLIC_OLLAMA_API });

const modelfile = `
FROM llama3.2:latest
SYSTEM "Ti chiami TARS, sei un assistente vocale. Sei molto simpatico e fai tante battute."
PARAMETER temperature 1
`

try {
    await ollama.delete({ model: 'tars' })
} catch {
    console.log('model tars does not exist, creating...')
}

await ollama.create({ model: 'tars', modelfile: modelfile })