'use client'

import { useState, useRef, useEffect } from 'react'
import {
    MessageCircleHeart,
    Send,
    Sparkles,
    RotateCcw,
    ShieldCheck,
} from 'lucide-react'

interface ChatMessage {
    id: string
    role: 'user' | 'model'
    text: string
    time: string
}

const QUICK_STARTERS = [
    'Hari ini rasanya melelahkan sekali...',
    'Aku lagi overthinking soal banyak hal',
    'Aku butuh teman cerita sebentar',
    'Bantu aku menenangkan pikiran malam ini',
]

export default function MindChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'model',
            text: 'Hai, selamat datang di ruang curhat MINDORA 🌿 Aku sudah melihat sedikit catatan suasana hatimu akhir-akhir ini. Apa pun yang sedang mengganjal di pikiranmu hari ini, ceritakan saja pelan-pelan—aku di sini untuk mendengarkan tanpa menghakimi.',
            time: 'Sekarang',
        },
    ])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    function getCurrentTime() {
        return new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    async function handleSendMessage(customText?: string) {
        const textToSend = (customText ?? input).trim()
        if (!textToSend || isTyping) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: textToSend,
            time: getCurrentTime(),
        }

        const updatedMessages = [...messages, userMsg]
        setMessages(updatedMessages)
        setInput('')
        setIsTyping(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: updatedMessages.map((m) => ({
                        role: m.role,
                        text: m.text,
                    })),
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Gagal mendapatkan balasan dari AI.')
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text: data.reply || 'Aku di sini mendengarkanmu.',
                    time: getCurrentTime(),
                },
            ])
        } catch (err: any) {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'model',
                    text:
                        err?.message ||
                        'Koneksi sempat terputus sebentar. Coba kirim ulang pesanmu ya.',
                    time: getCurrentTime(),
                },
            ])
        } finally {
            setIsTyping(false)
        }
    }

    function handleResetChat() {
        setMessages([
            {
                id: 'welcome-reset',
                role: 'model',
                text: 'Obrolan baru dimulai. Tarik napas pelan—ceritakan apa yang sedang kamu rasakan saat ini 🌿',
                time: getCurrentTime(),
            },
        ])
    }

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100dvh-9rem)] md:h-[calc(100dvh-3.5rem)] overflow-hidden">
            {/* HEADER CHAT */}
            <header className="bg-purple-700 rounded-3xl p-4 sm:p-5 text-white shadow-sm flex items-center justify-between gap-3 shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                        <MessageCircleHeart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-base sm:text-lg font-extrabold tracking-tight">
                                Mind Companion
                            </h1>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <p className="text-[11px] text-purple-100 flex items-center gap-1 mt-0.5">
                            <Sparkles className="w-3 h-3" /> Memahami konteks mood & jurnalmu
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleResetChat}
                    className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition cursor-pointer active:scale-95"
                    title="Mulai Obrolan Baru"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </header>

            {/* AREA PERCAKAPAN (SCROLL TERPISAH DI BAWAH HEADER) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-2 pt-4 pb-3 space-y-4">
                <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-100 border border-slate-200/80 px-3 py-1 rounded-full">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Ruang aman & privat • Bukan pengganti konsultasi profesional
                    </span>
                </div>

                {messages.map((msg) => {
                    const isUser = msg.role === 'user'
                    return (
                        <div
                            key={msg.id}
                            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'
                                }`}
                        >
                            <div
                                className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-2xs ${isUser
                                        ? 'bg-purple-700 text-white rounded-br-md'
                                        : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-md'
                                    }`}
                            >
                                {msg.text}
                            </div>
                            <span className="text-[10px] text-slate-400 mt-1 px-2">
                                {isUser ? 'Kamu' : 'Mindora'} • {msg.time}
                            </span>
                        </div>
                    )
                })}

                {isTyping && (
                    <div className="flex items-start">
                        <div className="bg-white border border-slate-200/90 px-4 py-3 rounded-3xl rounded-bl-md shadow-2xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce [animation-delay:150ms]" />
                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-bounce [animation-delay:300ms]" />
                        </div>
                    </div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* PEMANTIK CURHAT CEPAT */}
            {messages.length <= 2 && !isTyping && (
                <div className="flex flex-wrap gap-1.5 pb-2.5 px-1 shrink-0">
                    {QUICK_STARTERS.map((starter) => (
                        <button
                            key={starter}
                            type="button"
                            onClick={() => handleSendMessage(starter)}
                            className="text-[11px] font-medium px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/80 hover:bg-purple-100 transition cursor-pointer active:scale-95"
                        >
                            {starter}
                        </button>
                    ))}
                </div>
            )}

            {/* INPUT BAR BAWAH */}
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                }}
                className="bg-white border border-slate-200/90 rounded-3xl p-2 shadow-sm flex items-end gap-2 shrink-0"
            >
                <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                        }
                    }}
                    placeholder="Ceritakan apa yang sedang kamu rasakan..."
                    className="flex-1 max-h-28 px-3.5 py-2.5 bg-transparent text-slate-900 text-xs sm:text-sm outline-none resize-none leading-relaxed"
                />

                <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="p-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white shadow-sm transition disabled:opacity-40 cursor-pointer active:scale-90 shrink-0"
                    title="Kirim Pesan"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    )
}