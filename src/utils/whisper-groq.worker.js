import { MessageTypes } from './presets'

self.addEventListener('message', async (event) => {
    console.log('[Worker] Received message:', event.data.type)
    const { type, audio, apiKey } = event.data

    if (type === MessageTypes.INFERENCE_REQUEST) {
        console.log('[Worker] Starting transcription, audio length:', audio?.length, 'API key present:', !!apiKey)
        await transcribe(audio, apiKey)
    }
})

async function transcribe(audioData, apiKey) {
    try {
        console.log('[Worker] Transcribe function called')

        if (!apiKey) {
            console.error('[Worker] No API key provided')
            throw new Error('Groq API key not provided. Please click "Set API Key" button.')
        }

        console.log('[Worker] Sending LOADING message')
        self.postMessage({ type: MessageTypes.LOADING, status: 'loading' })

        // Convert Float32Array to WAV blob
        console.log('[Worker] Converting audio to WAV blob')
        const audioBlob = await convertAudioToBlob(audioData)
        console.log('[Worker] Audio blob created, size:', audioBlob.size)

        self.postMessage({ type: MessageTypes.LOADING, status: 'processing' })

        // Create FormData
        const formData = new FormData()
        formData.append('file', audioBlob, 'audio.wav')
        formData.append('model', 'whisper-large-v3-turbo')
        formData.append('response_format', 'json')

        console.log('[Worker] Calling Groq API...')

        // Call Groq API directly
        const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        })

        console.log('[Worker] Groq API response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Worker] Groq API error:', errorText)
            throw new Error(`Groq API error (${response.status}): ${errorText}`)
        }

        const result = await response.json()
        console.log('[Worker] Transcription result:', result)

        // Format result
        const formattedResult = [{
            text: result.text || '',
            start: 0,
            end: 0,
            index: 0
        }]

        console.log('[Worker] Sending RESULT message')
        self.postMessage({
            type: MessageTypes.RESULT,
            results: formattedResult,
            isDone: true
        })

        console.log('[Worker] Sending INFERENCE_DONE message')
        self.postMessage({
            type: MessageTypes.INFERENCE_DONE
        })

    } catch (error) {
        console.error('[Worker] Transcription error:', error)
        self.postMessage({
            type: 'ERROR',
            error: error.message || 'Failed to transcribe audio'
        })
    }
}

async function convertAudioToBlob(float32Array) {
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
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true)
    view.setUint16(32, numChannels * (bitsPerSample / 8), true)
    view.setUint16(34, bitsPerSample, true)
    writeString(view, 36, 'data')
    view.setUint32(40, dataLength, true)

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
