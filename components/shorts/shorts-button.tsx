"use client"

import { useState } from "react"

function ShortsIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M17.77 10.32l-1.2-.5a3.98 3.98 0 00-2.4-3.37l-.55-.23a4 4 0 00-5.13 2.34l-.23.55a3.98 3.98 0 00.64 4.03l-.84.35a4 4 0 00-2.34 5.13l.23.55a4 4 0 005.13 2.34l1.2.5a3.98 3.98 0 002.4 3.37l.55.23a4 4 0 005.13-2.34l.23-.55a3.98 3.98 0 00-.64-4.03l.84-.35a4 4 0 002.34-5.13l-.23-.55a4 4 0 00-5.13-2.34zm-3.77 6.18V11l4 2.75-4 2.75z" />
        </svg>
    )
}

function PlayIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M8 5v14l11-7z" />
        </svg>
    )
}

export function ShortsButton() {
    const [isHovered, setIsHovered] = useState(false)
    const [isPressed, setIsPressed] = useState(false)

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false)
                setIsPressed(false)
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onTouchStart={() => setIsPressed(true)}
            onTouchEnd={() => setIsPressed(false)}
            className={`hover:cursor-pointer
        group relative overflow-hidden
        flex items-center gap-2
        px-3 py-1.5
        text-white font-medium text-sm
        rounded-xl
        shadow-sm shadow-red-500/30
        hover:shadow-md hover:shadow-red-500/40
        transition-all duration-300 ease-out
        transform transform-gpu hover:scale-105
        ${isPressed ? "scale-95" : ""}
      `}
            style={{ background: 'linear-gradient(to right, #f43f5e, #ef4444, #f97316)' }}
        >
            {/* Efeito de brilho animado */}
            <span
                className={`
          absolute inset-0 
          bg-gradient-to-r from-transparent via-white/25 to-transparent
          -translate-x-full
          ${isHovered ? "animate-[shimmer_0.8s_ease-in-out]" : ""}
        `}
                style={{
                    animation: isHovered ? "shimmer 0.8s ease-in-out" : "none",
                }}
            />

            {/* Partículas decorativas */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full opacity-80 animate-pulse" />
            <span className="absolute -bottom-0.5 -left-0.5 w-2 h-2 bg-pink-300 rounded-full opacity-70 animate-pulse delay-150" />

            {/* Container do ícone */}
            <span
                className={`
          relative flex items-center justify-center
          w-6 h-6
          bg-white/20 backdrop-blur-sm
          rounded-lg
          transition-all duration-300
          group-hover:bg-white/30
          group-hover:rotate-6
          ${isPressed ? "scale-90" : ""}
        `}
            >
                {/* Ícone de Shorts estilizado */}
                <span className="relative">
                    <ShortsIcon className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" />
                    {/* Mini ícone de play */}
                    <PlayIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 opacity-90" />
                </span>
            </span>

            {/* Texto */}
            <span className="relative flex flex-col items-start">
                <span className="text-sm font-semibold tracking-wide">Shorts</span>
            </span>

            {/* Badge de novo */}
            <span
                className={`
          absolute top-0.5 right-1
          px-1.5 py-0
          bg-yellow-400 text-yellow-900
          text-[8px] font-bold uppercase tracking-wide
          rounded-full
          shadow-sm
        `}
            >
                New
            </span>

            {/* Estilo para animação shimmer */}
            <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
        </div>
    )
}
