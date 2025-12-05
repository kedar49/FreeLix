import React, { useRef, useEffect } from 'react'

export default function FileDisplay(props) {
    const { handleAudioReset, file, audioStream, handleFormSubmission } = props
    const audioRef = useRef()

    useEffect(() => {
        if (!file && !audioStream) { return }
        if (file) {
            console.log('HERE FILE', file)
            audioRef.current.src = URL.createObjectURL(file)
        } else {
            console.log('EHER AUDIO', audioStream)
            audioRef.current.src = URL.createObjectURL(audioStream)
        }
    }, [audioStream, file])


    return (
        <main className='flex-1 p-4 flex flex-col gap-4 text-center sm:gap-6 justify-center pb-20 w-full max-w-prose mx-auto'>
            <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl'>
                Your <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Audio</span>
            </h1>

            <div className='bg-white rounded-2xl shadow-lg p-6 border border-slate-200'>
                <div className='flex flex-col text-left mb-4'>
                    <h3 className='font-semibold text-slate-700 mb-1 flex items-center gap-2'>
                        <i className="fa-solid fa-file-audio text-indigo-600"></i>
                        File Name
                    </h3>
                    <p className='truncate text-slate-600 bg-slate-50 px-3 py-2 rounded-lg'>
                        {file ? file?.name : 'Recorded Audio'}
                    </p>
                </div>

                <div className='flex flex-col mb-4'>
                    <audio ref={audioRef} className='w-full rounded-lg' controls>
                        Your browser does not support the audio element.
                    </audio>
                </div>

                <div className='flex items-center justify-between gap-4'>
                    <button
                        onClick={handleAudioReset}
                        className='px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-all duration-200 font-medium flex items-center gap-2 border border-slate-200 hover:border-red-200'
                    >
                        <i className="fa-solid fa-rotate-left"></i>
                        Reset
                    </button>
                    <button
                        onClick={handleFormSubmission}
                        className='px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transition-all duration-200'
                    >
                        <span>Transcribe</span>
                        <i className="fa-solid fa-wand-magic-sparkles"></i>
                    </button>
                </div>
            </div>
        </main>
    )
}
