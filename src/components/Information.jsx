import React, { useState, useEffect, useRef } from 'react'
import Transcription from './Transcription'
import Translation from './Translation'

export default function Information(props) {
    const { output, finished } = props
    const [tab, setTab] = useState('transcription')
    const [translation, setTranslation] = useState(null)
    const [toLanguage, setToLanguage] = useState('Select language')
    const [translating, setTranslating] = useState(null)
    console.log(output)

    const worker = useRef()

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            })
        }

        const onMessageReceived = async (e) => {
            switch (e.data.status) {
                case 'initiate':
                    console.log('DOWNLOADING')
                    break;
                case 'progress':
                    console.log('LOADING')
                    break;
                case 'update':
                    setTranslation(e.data.output)
                    console.log(e.data.output)
                    break;
                case 'complete':
                    setTranslating(false)
                    console.log("DONE")
                    break;
            }
        }

        worker.current.addEventListener('message', onMessageReceived)

        return () => worker.current.removeEventListener('message', onMessageReceived)
    })

    const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || ''

    function handleCopy() {
        navigator.clipboard.writeText(textElement)
    }

    function handleDownload() {
        const element = document.createElement("a")
        const file = new Blob([textElement], { type: 'text/plain' })
        element.href = URL.createObjectURL(file)
        element.download = `LanguageBridge_${new Date().toISOString().split('T')[0]}.txt`
        document.body.appendChild(element)
        element.click()
    }

    function generateTranslation() {
        if (translating || toLanguage === 'Select language') {
            return
        }

        setTranslating(true)

        worker.current.postMessage({
            text: output.map(val => val.text),
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage
        })
    }




    return (
        <main className='flex-1 p-4 flex flex-col gap-4 text-center sm:gap-6 justify-center pb-20 max-w-prose w-full mx-auto'>
            <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl'>
                Your <span className='bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>Results</span>
            </h1>

            <div className='grid grid-cols-2 sm:mx-auto bg-white rounded-xl overflow-hidden items-center p-1.5 shadow-lg border-2 border-indigo-200 max-w-md'>
                <button
                    onClick={() => setTab('transcription')}
                    className={'px-6 py-3 rounded-lg font-semibold transition-all duration-200 ' + (tab === 'transcription' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600')}
                >
                    <i className="fa-solid fa-file-lines mr-2"></i>
                    Transcription
                </button>
                <button
                    onClick={() => setTab('translation')}
                    className={'px-6 py-3 rounded-lg font-semibold transition-all duration-200 ' + (tab === 'translation' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' : 'text-slate-600 hover:text-indigo-600')}
                >
                    <i className="fa-solid fa-language mr-2"></i>
                    Translation
                </button>
            </div>

            <div className='my-6 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
                {(!finished || translating) && (
                    <div className='grid place-items-center py-8'>
                        <div className='relative'>
                            <div className='w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin'></div>
                        </div>
                    </div>
                )}
                {tab === 'transcription' ? (
                    <Transcription {...props} textElement={textElement} />
                ) : (
                    <Translation {...props} toLanguage={toLanguage} translating={translating} textElement={textElement} setTranslating={setTranslating} setTranslation={setTranslation} setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
                )}
            </div>

            <div className='flex items-center gap-3 mx-auto'>
                <button
                    onClick={handleCopy}
                    title="Copy to clipboard"
                    className='bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 font-semibold border-2 border-indigo-200 hover:border-indigo-300'
                >
                    <i className="fa-solid fa-copy"></i>
                    <span className='hidden sm:inline'>Copy</span>
                </button>
                <button
                    onClick={handleDownload}
                    title="Download as text file"
                    className='bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 font-semibold'
                >
                    <i className="fa-solid fa-download"></i>
                    <span className='hidden sm:inline'>Download</span>
                </button>
            </div>
        </main>
    )
}
