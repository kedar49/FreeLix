import React from 'react'

export default function Header() {
    return (
        <header className='flex items-center justify-between gap-4 p-4 md:p-6 border-b border-slate-100'>
            <a href="/" className='group flex items-center gap-2'>
                <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200'>
                    <i className="fa-solid fa-bridge text-white text-lg"></i>
                </div>
                <div className='flex flex-col'>
                    <h1 className='font-extrabold text-xl md:text-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight'>
                        LanguageBridge
                    </h1>
                    <p className='text-[10px] md:text-xs text-slate-500 font-medium -mt-0.5'>AI-Powered Translation</p>
                </div>
            </a>
            <div className='gap-3 flex items-center'>
                <a href="https://github.com/Avi2894" target='_blank' className='flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2 rounded-full font-medium transition-all duration-200 shadow-md hover:shadow-lg' rel="noreferrer">
                    <i className="fa-brands fa-github"></i>
                    <span className='hidden sm:inline'>GitHub</span>
                </a>
            </div>
        </header>
    )
}
