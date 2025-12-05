import { HfInference } from '@huggingface/inference'
import { MessageTypes } from './presets'

// Initialize Hugging Face client
let hfClient = null

self.addEventListener('message', async (event) => {
    const { type, audio, apiKey } = event.data

    if (type === MessageTypes.INFERENCE_REQUEST) {
        await transcribe(audio, apiKey)
    }
})

async function transcribe(audioData, apiKey) {
    try {
        // Initialize client with API key
        if (!hfClient && apiKey) {
            hfClient = new HfInference(apiKey)
        }

        if (!hfClient) {
            throw new Error('Hugging Face API key not provided')
        }

        sendLoadingMessage('loading')

        // Convert Float32Array to Blob
        const audioBlob = await convertAudioToBlob(audioData)

        sendLoadingMessage('processing')

        // Call Hugging Face Inference API
        const result = await hfClient.automaticSpeechRecognition({
            data: audioBlob,
            model: 'openai/whisper-large-v3'
        })

        // Format result to match expected output
        const formattedResult = [{
            text: result.text,
            start: 0,
            end: 0,
            index: 0
        }]

        // Send result
        self.postMessage({
            type: MessageTypes.RESULT,
            results: formattedResult,
            isDone: true
        })

        // Send completion
        self.postMessage({
            type: MessageTypes.INFERENCE_DONE
        })

    } catch (error) {
        console.error('Transcription error:', error)
        self.postMessage({
            type: 'ERROR',
            error: error.message
        })
    }
}

async function convertAudioToBlob(float32Array) {
    // Convert Float32Array to WAV format
    const sampleRate = 16000
    const numChannels = 1
    const bitsPerSample = 16

    const dataLength = float32Array.length * (bitsPerSample / 8)
    const buffer = new ArrayBuffer(44 + dataLength)
    const view = new DataView(buffer)

    // WAV header
    writeString(view, 0, 'RIFF')
    view.setUint32(4, 36 + dataLength, true)
    writeString(view, 8, 'WAVE')
    writeString(view, 12, 'fmt ')
    view.setUint32(16, 16, true) // fmt chunk size
    view.setUint16(20, 1, true) // PCM format
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true)
    view.setUint16(32, numChannels * (bitsPerSample / 8), true)
    view.setUint16(34, bitsPerSample, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)

    // Convert float samples to 16-bit PCM
    const offset = 44
    for (let i = 0; i < float32Array.length; i++) {
        const sample = Math.max(-1, Math.min(1, float32Array[i]))
        view.setInt16(offset + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
    }

    return new Blob([buffer], { type: 'audio/wav' })
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
    }
}

function sendLoadingMessage(status) {
    self.postMessage({
        type: MessageTypes.LOADING,
        status
    })
}
