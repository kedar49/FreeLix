import React from 'react'

export default function Transcribing(props) {
    const { downloading, progress = 0 } = props

    return (
        <div className='flex items-center flex-1 flex-col justify-center gap-10 md:gap-14 text-center pb-24 p-4'>
            <div className='flex flex-col gap-4 sm:gap-6'>
                <div className='relative'>
                    <div className='absolute inset-0 flex items-center justify-center'>
                        <div className='w-32 h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-20 animate-ping'></div>
                    </div>
                    <div className='relative w-32 h-32 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl'>
                        <i className="fa-solid fa-wand-magic-sparkles text-white text-4xl animate-pulse"></i>
                    </div>
                </div>

                <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
                    Transcribing
                </h1>
                <div className='flex flex-col gap-2'>
                    <p className='text-lg text-slate-600 font-medium'>
                        {!downloading ? 'Loading AI model...' : 'Processing your audio...'}
                    </p>
                    {downloading && progress > 0 && (
                        <p className='text-sm text-indigo-600 font-semibold'>
                            Downloading: {progress}%
                        </p>
                    )}
                </div>
            </div>

            <div className='flex flex-col gap-3 sm:gap-4 max-w-[400px] mx-auto w-full'>
                {downloading && progress > 0 ? (
                    <div className='relative h-4 bg-slate-200 rounded-full overflow-hidden'>
                        <div
                            className='absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300'
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                ) : (
                    [0, 1, 2].map(val => {
                        return (
                            <div key={val} className='relative h-3 sm:h-4 bg-slate-200 rounded-full overflow-hidden'>
                                <div className={'absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full loading ' + `loading${val}`}></div>
                            </div>
                        )
                    })
                )}
            </div>

            <div className='bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-100 max-w-md'>
                <div className='flex items-start gap-3 text-left'>
                    <i className="fa-solid fa-bolt text-indigo-600 mt-1"></i>
                    <div className='text-sm text-slate-600'>
                        <p className='font-semibold text-slate-700 mb-1'>⚡ Whisper Large V3 via Groq</p>
                        <p>Lightning-fast transcription with state-of-the-art accuracy. No downloads required!</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
