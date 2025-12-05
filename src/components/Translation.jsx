import React from 'react'
import { LANGUAGES } from '../utils/presets'

export default function Translation(props) {
    const { textElement, toLanguage, translating, setToLanguage, generateTranslation } = props
    return (
        <>
            {(textElement && !translating) && (
                <div className='bg-white rounded-xl shadow-lg p-6 text-left border border-slate-200'>
                    <div className='flex items-center gap-2 mb-4 pb-3 border-b border-slate-200'>
                        <i className="fa-solid fa-language text-purple-600"></i>
                        <h3 className='font-semibold text-slate-700'>Translated Text</h3>
                    </div>
                    <p className='text-slate-700 leading-relaxed whitespace-pre-wrap'>{textElement}</p>
                </div>
            )}
            {!translating && (
                <div className='bg-white rounded-xl shadow-lg p-6 border border-slate-200'>
                    <div className='flex flex-col gap-3'>
                        <label className='text-sm font-semibold text-slate-700 flex items-center gap-2'>
                            <i className="fa-solid fa-globe text-indigo-600"></i>
                            Target Language
                        </label>
                        <div className='flex items-stretch gap-3 flex-col sm:flex-row'>
                            <select
                                value={toLanguage}
                                className='flex-1 outline-none bg-slate-50 border-2 border-slate-200 focus:border-indigo-400 duration-200 px-4 py-3 rounded-xl font-medium text-slate-700'
                                onChange={(e) => setToLanguage(e.target.value)}
                            >
                                <option value={'Select language'}>Select language</option>
                                {Object.entries(LANGUAGES).map(([key, value]) => {
                                    return (
                                        <option key={key} value={value}>{key}</option>
                                    )
                                })}
                            </select>
                            <button
                                onClick={generateTranslation}
                                disabled={toLanguage === 'Select language'}
                                className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg'
                            >
                                <i className="fa-solid fa-wand-magic-sparkles"></i>
                                Translate
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
