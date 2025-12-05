// Translation worker using Groq's Llama 3.1 8B Instant
self.addEventListener('message', async (event) => {
    const { text, tgt_lang, src_lang, apiKey } = event.data

    try {
        console.log('[Translation Worker] Starting translation')

        if (!apiKey) {
            throw new Error('Groq API key not provided')
        }

        self.postMessage({ status: 'initiate' })

        // Join text array if needed
        const inputText = Array.isArray(text) ? text.join(' ') : text

        if (!inputText || inputText.trim() === '') {
            throw new Error('No text to translate')
        }

        self.postMessage({ status: 'progress' })

        // Convert language codes to readable names
        const targetLanguage = getLanguageName(tgt_lang)
        const sourceLanguage = getLanguageName(src_lang || 'eng_Latn')

        console.log('[Translation Worker] Translating from', sourceLanguage, 'to', targetLanguage)

        // Create prompt for Llama
        const prompt = `Translate the following text from ${sourceLanguage} to ${targetLanguage}. Only provide the translation, no explanations or additional text.

Text to translate:
${inputText}

Translation:`

        // Call Groq Chat Completions API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional translator. Translate text accurately while preserving meaning, tone, and context. Only provide the translation without any explanations.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('[Translation Worker] Groq API error:', errorText)
            throw new Error(`Translation API error (${response.status}): ${errorText}`)
        }

        const result = await response.json()
        const translatedText = result.choices[0]?.message?.content?.trim() || ''

        console.log('[Translation Worker] Translation complete')

        self.postMessage({
            status: 'update',
            output: translatedText
        })

        self.postMessage({
            status: 'complete',
            output: translatedText
        })

    } catch (error) {
        console.error('[Translation Worker] Error:', error)
        self.postMessage({
            status: 'error',
            error: error.message
        })
    }
})

// Convert NLLB language codes to readable names
function getLanguageName(code) {
    const languages = {
        'eng_Latn': 'English',
        'spa_Latn': 'Spanish',
        'fra_Latn': 'French',
        'deu_Latn': 'German',
        'ita_Latn': 'Italian',
        'por_Latn': 'Portuguese',
        'nld_Latn': 'Dutch',
        'rus_Cyrl': 'Russian',
        'pol_Latn': 'Polish',
        'ukr_Cyrl': 'Ukrainian',
        'ces_Latn': 'Czech',
        'ron_Latn': 'Romanian',
        'ell_Grek': 'Greek',
        'zho_Hans': 'Chinese (Simplified)',
        'zho_Hant': 'Chinese (Traditional)',
        'jpn_Jpan': 'Japanese',
        'kor_Hang': 'Korean',
        'vie_Latn': 'Vietnamese',
        'tha_Thai': 'Thai',
        'ind_Latn': 'Indonesian',
        'zsm_Latn': 'Malay',
        'tgl_Latn': 'Tagalog',
        'hin_Deva': 'Hindi',
        'ben_Beng': 'Bengali',
        'urd_Arab': 'Urdu',
        'pan_Guru': 'Punjabi',
        'mar_Deva': 'Marathi',
        'tel_Telu': 'Telugu',
        'tam_Taml': 'Tamil',
        'guj_Gujr': 'Gujarati',
        'kan_Knda': 'Kannada',
        'mal_Mlym': 'Malayalam',
        'arb_Arab': 'Arabic',
        'heb_Hebr': 'Hebrew',
        'pes_Arab': 'Persian',
        'tur_Latn': 'Turkish',
        'swh_Latn': 'Swahili',
        'hau_Latn': 'Hausa',
        'yor_Latn': 'Yoruba',
        'zul_Latn': 'Zulu',
        'afr_Latn': 'Afrikaans',
        'amh_Ethi': 'Amharic',
        'swe_Latn': 'Swedish',
        'nob_Latn': 'Norwegian',
        'dan_Latn': 'Danish',
        'fin_Latn': 'Finnish',
        'hun_Latn': 'Hungarian',
        'bul_Cyrl': 'Bulgarian',
        'srp_Cyrl': 'Serbian',
        'hrv_Latn': 'Croatian',
        'slk_Latn': 'Slovak',
        'slv_Latn': 'Slovenian'
    }

    return languages[code] || 'English'
}
