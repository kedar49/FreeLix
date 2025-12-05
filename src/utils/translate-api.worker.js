import { HfInference } from '@huggingface/inference'

let hfClient = null

self.addEventListener('message', async (event) => {
    const { text, tgt_lang, apiKey } = event.data

    try {
        // Initialize client with API key
        if (!hfClient && apiKey) {
            hfClient = new HfInference(apiKey)
        }

        if (!hfClient) {
            throw new Error('Hugging Face API key not provided')
        }

        self.postMessage({ status: 'initiate' })

        // Convert language code to model format
        const targetLang = convertLanguageCode(tgt_lang)

        // Join text array if needed
        const inputText = Array.isArray(text) ? text.join(' ') : text

        self.postMessage({ status: 'progress' })

        // Call Hugging Face Translation API
        const result = await hfClient.translation({
            model: 'facebook/nllb-200-distilled-600M',
            inputs: inputText,
            parameters: {
                src_lang: 'eng_Latn',
                tgt_lang: targetLang
            }
        })

        const translatedText = result.translation_text || result

        self.postMessage({
            status: 'update',
            output: translatedText
        })

        self.postMessage({
            status: 'complete',
            output: translatedText
        })

    } catch (error) {
        console.error('Translation error:', error)
        self.postMessage({
            status: 'error',
            error: error.message
        })
    }
})

function convertLanguageCode(code) {
    // Language codes are already in the correct format (e.g., 'spa_Latn')
    return code
}
