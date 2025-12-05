import React from 'react'

export default function Transcription(props) {
    const { textElement } = props

    return (
        <div className='bg-white rounded-xl shadow-lg p-6 text-left border border-slate-200'>
            <div className='flex items-center gap-2 mb-4 pb-3 border-b border-slate-200'>
                <i className="fa-solid fa-quote-left text-indigo-600"></i>
                <h3 className='font-semibold text-slate-700'>Transcribed Text</h3>
            </div>
            <p className='text-slate-700 leading-relaxed whitespace-pre-wrap'>{textElement}</p>
        </div>
    )
}
