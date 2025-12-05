import React, { useState, useEffect, useRef } from 'react'

export default function HomePage(props) {
    const { setAudioStream, setFile } = props

    const [recordingStatus, setRecordingStatus] = useState('inactive')
    const [audioChunks, setAudioChunks] = useState([])
    const [duration, setDuration] = useState(0)

    const mediaRecorder = useRef(null)

    const mimeType = 'audio/webm'

    async function startRecording() {
        let tempStream
        console.log('Start recording')

        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false
            })
            tempStream = streamData
        } catch (err) {
            console.log(err.message)
            return
        }
        setRecordingStatus('recording')

        //create new Media recorder instance using the stream
        const media = new MediaRecorder(tempStream, { type: mimeType })
        mediaRecorder.current = media

        mediaRecorder.current.start()
        let localAudioChunks = []
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === 'undefined') { return }
            if (event.data.size === 0) { return }
            localAudioChunks.push(event.data)
        }
        setAudioChunks(localAudioChunks)
    }

    async function stopRecording() {
        setRecordingStatus('inactive')
        console.log('Stop recording')

        mediaRecorder.current.stop()
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType })
            setAudioStream(audioBlob)
            setAudioChunks([])
            setDuration(0)
        }
    }

    useEffect(() => {
        if (recordingStatus === 'inactive') { return }

        const interval = setInterval(() => {
            setDuration(curr => curr + 1)
        }, 1000)

        return () => clearInterval(interval)
    })


    return (
        <main className='flex-1 p-4 flex flex-col gap-4 text-center sm:gap-6 justify-center pb-20'>
            <div className='flex flex-col gap-4 animate-fadeIn'>
                <div className='flex items-center justify-center gap-3 mb-2'>
                    <div className='w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl animate-pulse'>
                        <i className="fa-solid fa-bridge text-white text-3xl md:text-4xl"></i>
                    </div>
                </div>
                <h1 className='font-extrabold text-5xl sm:text-6xl md:text-7xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight'>
                    LanguageBridge
                </h1>
                <p className='text-lg md:text-xl text-slate-500 font-semibold -mt-2'>Break Language Barriers with AI</p>
                <h3 className='font-medium text-base md:text-lg text-slate-600 flex items-center justify-center gap-2 flex-wrap mt-2'>
                    <span className='flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full'>
                        <i className="fa-solid fa-microphone text-indigo-600"></i>
                        <span className='text-indigo-700 font-semibold'>Record</span>
                    </span>
                    <span className='text-purple-500 text-2xl'>→</span>
                    <span className='flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full'>
                        <i className="fa-solid fa-file-lines text-purple-600"></i>
                        <span className='text-purple-700 font-semibold'>Transcribe</span>
                    </span>
                    <span className='text-pink-500 text-2xl'>→</span>
                    <span className='flex items-center gap-2 bg-pink-50 px-3 py-1.5 rounded-full'>
                        <i className="fa-solid fa-language text-pink-600"></i>
                        <span className='text-pink-700 font-semibold'>Translate</span>
                    </span>
                </h3>
            </div>

            <div className='my-6'>
                <button
                    onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
                    className='group relative specialBtn px-8 py-4 rounded-2xl flex items-center justify-center gap-4 mx-auto w-80 max-w-full transition-all duration-300 hover:scale-105'
                >
                    <div className='flex items-center justify-between w-full'>
                        <p className='text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                            {recordingStatus === 'inactive' ? 'Start Recording' : 'Stop Recording'}
                        </p>
                        <div className='flex items-center gap-3'>
                            {duration !== 0 && (
                                <span className='text-sm font-mono bg-red-100 text-red-600 px-2 py-1 rounded-full animate-pulse'>
                                    {duration}s
                                </span>
                            )}
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${recordingStatus === 'recording'
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                                }`}>
                                <i className={`fa-solid fa-microphone text-white text-lg ${recordingStatus === 'recording' ? 'animate-bounce' : ''
                                    }`}></i>
                            </div>
                        </div>
                    </div>
                </button>
            </div>

            <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-3 justify-center'>
                    <div className='h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20'></div>
                    <p className='text-slate-500 font-medium'>or</p>
                    <div className='h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent w-20'></div>
                </div>

                <label className='cursor-pointer group'>
                    <div className='inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border-2 border-transparent hover:border-indigo-200'>
                        <i className="fa-solid fa-cloud-arrow-up text-indigo-600 text-xl group-hover:scale-110 transition-transform"></i>
                        <span className='font-medium text-slate-700 group-hover:text-indigo-600 transition-colors'>
                            Upload Audio File
                        </span>
                    </div>
                    <input
                        onChange={(e) => {
                            const tempFile = e.target.files[0]
                            setFile(tempFile)
                        }}
                        className='hidden'
                        type='file'
                        accept='.mp3,.wav,.webm'
                    />
                </label>
                <p className='text-xs text-slate-400'>Supports MP3, WAV, and WebM formats</p>
            </div>

            <div className='mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100 max-w-md mx-auto'>
                <div className='flex items-start gap-3 text-left'>
                    <i className="fa-solid fa-bolt text-indigo-600 mt-1"></i>
                    <div className='text-xs text-slate-600'>
                        <p className='font-semibold text-slate-700 mb-1'>⚡ Instant Processing</p>
                        <p>Uses Hugging Face API with Whisper Large V3. No downloads, instant results! Get your free API key to start.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
