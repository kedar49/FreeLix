import { useState, useRef, useEffect } from 'react'
import HomePage from './components/HomePage'
import Header from './components/Header'
import FileDisplay from './components/FileDisplay'
import Information from './components/Information'
import Transcribing from './components/Transcribing'
import { MessageTypes } from './utils/presets'

function App() {
  const [file, setFile] = useState(null)
  const [audioStream, setAudioStream] = useState(null)
  const [output, setOutput] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!localStorage.getItem('groq_api_key'))

  const isAudioAvailable = file || audioStream

  // Show setup instructions on first load
  useEffect(() => {
    if (!apiKey) {
      console.log('%c🔑 Setup Required!', 'font-size: 20px; color: #ff6b35; font-weight: bold;')
      console.log('%c1. Click "Set API Key" button (orange, pulsing)', 'font-size: 14px; color: #4f46e5;')
      console.log('%c2. Get FREE key: https://console.groq.com/keys', 'font-size: 14px; color: #4f46e5;')
      console.log('%c3. Paste and save - Done!', 'font-size: 14px; color: #4f46e5;')
    } else {
      console.log('%c✅ API Key Configured!', 'font-size: 16px; color: #10b981; font-weight: bold;')
    }
  }, [])

  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
    setOutput(null)
    setLoading(false)
    setDownloading(false)
    setFinished(false)
  }

  const worker = useRef(null)

  useEffect(() => {
    if (!worker.current) {
      // Use Groq API worker (fast, no downloads)
      worker.current = new Worker(new URL('./utils/whisper-groq.worker.js', import.meta.url), {
        type: 'module'
      })
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true)
          if (e.data.progress) {
            setLoadingProgress(Math.round(e.data.progress))
          }
          console.log('DOWNLOADING', e.data.progress)
          break;
        case 'LOADING':
          setLoading(true)
          console.log('LOADING')
          break;
        case 'RESULT':
          setOutput(e.data.results)
          console.log(e.data.results)
          break;
        case 'INFERENCE_DONE':
          setFinished(true)
          console.log("DONE")
          break;
        case 'ERROR':
          console.error('Worker error:', e.data.error)
          alert('Error: ' + e.data.error)
          setLoading(false)
          setDownloading(false)
          setFinished(false)
          break;
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  })

  function saveApiKey(key) {
    localStorage.setItem('groq_api_key', key)
    setApiKey(key)
    setShowApiKeyInput(false)
  }

  async function readAudioFrom(file) {
    const sampling_rate = 16000
    const audioCTX = new AudioContext({ sampleRate: sampling_rate })
    const response = await file.arrayBuffer()
    const decoded = await audioCTX.decodeAudioData(response)
    const audio = decoded.getChannelData(0)
    return audio
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) { return }

    if (!apiKey) {
      setShowApiKeyInput(true)
      alert('⚠️ Please set your Groq API key first!\n\n1. Click the "Set API Key" button (orange)\n2. Get free key from console.groq.com/keys\n3. Paste and save')
      return
    }

    try {
      console.log('Reading audio...')
      let audio = await readAudioFrom(file ? file : audioStream)
      console.log('Audio read successfully, length:', audio.length)

      worker.current.postMessage({
        type: MessageTypes.INFERENCE_REQUEST,
        audio,
        apiKey
      })
      console.log('Message sent to worker')
    } catch (error) {
      console.error('Error in handleFormSubmission:', error)
      alert('Failed to process audio: ' + error.message)
    }
  }

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full min-h-screen'>
      <section className='flex-1 flex flex-col'>
        <Header apiKey={apiKey} onApiKeyClick={() => setShowApiKeyInput(!showApiKeyInput)} />

        {showApiKeyInput && (
          <div className='p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200'>
            <div className='max-w-2xl mx-auto'>
              <h3 className='font-semibold text-slate-700 mb-2 flex items-center gap-2'>
                <i className="fa-solid fa-key text-indigo-600"></i>
                Groq API Key (Free)
              </h3>
              <p className='text-sm text-slate-600 mb-3'>
                Get your free API key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className='text-indigo-600 hover:underline font-medium'>Groq Console</a> - No credit card required!
              </p>
              <div className='flex gap-2'>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className='flex-1 px-4 py-2 rounded-lg border-2 border-indigo-200 focus:border-indigo-400 outline-none'
                />
                <button
                  onClick={() => saveApiKey(apiKey)}
                  className='px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all'
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {output ? (
          <Information output={output} finished={finished} apiKey={apiKey} />
        ) : loading ? (
          <Transcribing downloading={downloading} progress={loadingProgress} />
        ) : isAudioAvailable ? (
          <FileDisplay handleFormSubmission={handleFormSubmission} handleAudioReset={handleAudioReset} file={file} audioStream={audioStream} />
        ) : (
          <HomePage setFile={setFile} setAudioStream={setAudioStream} />
        )}
      </section>
      <footer className='py-8 text-center border-t border-slate-200 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center justify-center gap-2'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-md'>
              <i className="fa-solid fa-bridge text-white text-sm"></i>
            </div>
            <span className='font-bold text-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              LanguageBridge
            </span>
          </div>
          <p className='text-sm text-slate-600'>
            Built with <i className="fa-solid fa-heart text-red-500 animate-pulse"></i> by{' '}
            <a
              href="https://github.com/Avi2894"
              target="_blank"
              rel="noreferrer"
              className='font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-300'
            >
              Avinash Ghodke
            </a>
          </p>
          <p className='text-xs text-slate-500'>
            Powered by Groq API • Whisper Large V3 Turbo & Llama 3.1 8B Instant
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
