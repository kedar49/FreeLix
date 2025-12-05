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

  const isAudioAvailable = file || audioStream

  function handleAudioReset() {
    setFile(null)
    setAudioStream(null)
  }

  const worker = useRef(null)

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
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
      }
    }

    worker.current.addEventListener('message', onMessageReceived)

    return () => worker.current.removeEventListener('message', onMessageReceived)
  })

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

    let audio = await readAudioFrom(file ? file : audioStream)

    worker.current.postMessage({
      type: MessageTypes.INFERENCE_REQUEST,
      audio
    })
  }

  return (
    <div className='flex flex-col max-w-[1000px] mx-auto w-full min-h-screen'>
      <section className='flex-1 flex flex-col'>
        <Header />
        {output ? (
          <Information output={output} finished={finished} />
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
        </div>
      </footer>
    </div>
  )
}

export default App
