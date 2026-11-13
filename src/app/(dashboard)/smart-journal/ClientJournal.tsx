'use client'

import { useState } from 'react'
// Sesuaikan nama fungsi import berikut dengan yang ada di ./actions.ts
import { saveJournal, deleteJournal } from './actions'
import {
    BookHeart,
    Sparkles,
    PenLine,
    Save,
    RotateCcw,
    Loader2,
    Trash2,
    Search,
    Calendar,
    Clock,
    CheckCircle2,
    Lock,
    BookOpen,
    X,
    Lightbulb,
} from 'lucide-react'

const GUIDED_PROMPTS = [
    {
        category: 'Refleksi Harian',
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
        question:
            'Apa satu hal yang paling menyita pikiranku hari ini, dan apa yang sebenarnya sedang kubutuhkan?',
    },
    {
        category: 'Rasa Syukur',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        question:
            'Tiga hal sederhana apa yang membuatku tetap bertahan atau tersenyum hari ini?',
    },
    {
        category: 'Melepas Beban',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        question:
            'Jika aku bisa berbicara lembut pada diriku sendiri saat ini, kalimat menenangkan apa yang ingin kusampaikan?',
    },
    {
        category: 'Batas Sehat',
        badge: 'bg-sky-100 text-sky-700 border-sky-200',
        question:
            'Hal apa yang perlu kuikhlaskan atau kukatakan "cukup" minggu ini demi ketenangan batinku?',
    },
]

interface ClientJournalProps {
    initialEntries?: any[]
    entries?: any[]
    journals?: any[]
}

export default function ClientJournal({
    initialEntries,
    entries,
    journals,
}: ClientJournalProps) {
    // Menangani berbagai kemungkinan nama prop dari page.tsx agar anti-error
    const journalList = initialEntries ?? entries ?? journals ?? []

    const [title, setTitle] = useState('')
    const [selectedPrompt, setSelectedPrompt] = useState<string>(
        GUIDED_PROMPTS[0].question
    )
    const [content, setContent] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [toastSuccess, setToastSuccess] = useState(false)
    const [activeReadingEntry, setActiveReadingEntry] = useState<any | null>(null)

    // Statistik Ringkas
    const totalJournals = journalList.length
    const totalWords = journalList.reduce((acc, item) => {
        const text = String(item.content || '')
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        return acc + words
    }, 0)

    const currentWordCount = content.trim()
        ? content.trim().split(/\s+/).length
        : 0

    const filteredJournals = journalList.filter((item) => {
        if (!searchQuery.trim()) return true
        const q = searchQuery.toLowerCase()
        return (
            String(item.title || '')
                .toLowerCase()
                .includes(q) ||
            String(item.content || '')
                .toLowerCase()
                .includes(q)
        )
    })

    function handleSelectPrompt(question: string) {
        setSelectedPrompt(question)
        if (!title.trim()) {
            setTitle('Refleksi Hari Ini')
        }
    }

    function handleReset() {
        setTitle('')
        setContent('')
        setSelectedPrompt(GUIDED_PROMPTS[0].question)
    }

    async function handleSubmit(formData: FormData) {
        if (!content.trim()) return
        setIsSubmitting(true)
        setToastSuccess(false)

        const res = await saveJournal(formData)
        if (res?.success) {
            handleReset()
            setToastSuccess(true)
            setTimeout(() => setToastSuccess(false), 3500)
        } else if (res?.error) {
            alert(res.error)
        }
        setIsSubmitting(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Hapus catatan jurnal pribadi ini secara permanen?')) return
        setDeletingId(id)
        await deleteJournal(id)
        if (activeReadingEntry?.id === id) {
            setActiveReadingEntry(null)
        }
        setDeletingId(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE HEADER BANNER (TEMA SAGE GREEN & LAVENDER) */}
            <header className="bg-linear-to-br from-emerald-700 via-teal-700 to-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-emerald-950/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-emerald-100 mb-2">
                            <Lock className="w-3.5 h-3.5" /> Private Encrypted Space (RLS)
                        </span>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                            Smart Journal
                        </h1>
                        <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-md leading-relaxed">
                            Ruang aman tanpa penilaian untuk mengurai pikiran dan perasaanmu.
                        </p>
                    </div>

                    {/* Mini App Status Pills */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3 shrink-0">
                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                                Total Jurnal
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {totalJournals} Catatan
                            </p>
                        </div>

                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                                Kata Tertulis
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {totalWords.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* TOAST NOTIFIKASI SUKSES */}
            {toastSuccess && (
                <div className="animate-fade-up bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Tulisan jurnalmu berhasil disimpan secara privat!
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-lg">
                        Terkunci RLS
                    </span>
                </div>
            )}

            {/* GRID UTAMA: EDITOR REFLEKSI & ARSIP JURNAL */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* KOLOM KIRI (7 KOLOM): EDITOR JURNAL REFLEKTIF */}
                <form
                    action={handleSubmit}
                    className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden"
                >
                    {/* Mengirimkan prompt terpilih ke server action (baik nama kolom prompt_used maupun prompt) */}
                    <input type="hidden" name="prompt_used" value={selectedPrompt} />
                    <input type="hidden" name="prompt" value={selectedPrompt} />

                    {/* Header Editor */}
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                                <PenLine className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    Tulis Refleksi Baru
                                </h2>
                                <p className="text-[11px] text-slate-500">
                                    Hanya kamu yang dapat membaca tulisan ini
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="p-2 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                                title="Bersihkan Editor"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !content.trim()}
                                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition shadow-sm shadow-purple-700/20 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                Simpan
                            </button>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-5">
                        {/* 1. PILIH PEMANTIK REFLEKSI (GRID VERTIKAL RAPI TANPA SCROLL SAMPING) */}
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                                    1. Pilih Pertanyaan Pemantik
                                </label>
                                <span className="text-[11px] text-slate-400">
                                    Ketuk untuk memilih
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {GUIDED_PROMPTS.map((item) => {
                                    const isSelected = selectedPrompt === item.question
                                    return (
                                        <button
                                            key={item.category}
                                            type="button"
                                            onClick={() => handleSelectPrompt(item.question)}
                                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-95 flex flex-col justify-between ${isSelected
                                                    ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-400/20 shadow-2xs'
                                                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-white hover:border-slate-300'
                                                }`}
                                        >
                                            <span
                                                className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full border mb-2 ${item.badge}`}
                                            >
                                                {item.category}
                                            </span>
                                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                                                “{item.question}”
                                            </p>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Kotak Pertanyaan Terpilih yang Sedang Dijawab */}
                        <div className="bg-purple-50/60 border border-purple-200/70 rounded-2xl p-3.5 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                    Fokus Refleksi Saat Ini
                                </p>
                                <p className="text-xs sm:text-sm font-medium text-slate-800 italic mt-0.5 leading-relaxed">
                                    “{selectedPrompt}”
                                </p>
                            </div>
                        </div>

                        {/* 2. JUDUL CATATAN */}
                        <div>
                            <label
                                htmlFor="journal-title"
                                className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5"
                            >
                                2. Judul Catatan
                            </label>
                            <input
                                id="journal-title"
                                name="title"
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Malam yang cukup melelahkan, tapi aku bertahan..."
                                className="w-full px-4 py-2.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                            />
                        </div>

                        {/* 3. ISI TULISAN REFLEKSI */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="journal-content"
                                    className="text-xs font-bold text-slate-700 uppercase tracking-wide"
                                >
                                    3. Tuangkan Isi Pikiranmu
                                </label>
                                <span className="text-[11px] font-medium text-slate-400">
                                    {currentWordCount} kata
                                </span>
                            </div>

                            <textarea
                                id="journal-content"
                                name="content"
                                rows={6}
                                required
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Tuliskan apa saja yang sedang kamu rasakan tanpa perlu khawatir soal tata bahasa..."
                                className="w-full p-4 bg-white text-slate-900 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-y leading-relaxed"
                            />
                        </div>

                        {/* TOMBOL SIMPAN BESAR DI MOBILE */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className="w-full sm:hidden py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-2xl shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Simpan Jurnal Pribadi
                        </button>
                    </div>
                </form>

                {/* KOLOM KANAN (5 KOLOM): ARSIP & RIWAYAT JURNAL */}
                <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <BookHeart className="w-4 h-4 text-purple-700" />
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    Arsip Jurnalmu
                                </h2>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/70">
                                {filteredJournals.length} tulisan
                            </span>
                        </div>

                        {/* Search Bar ala Mobile App */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul atau isi jurnal..."
                                className="w-full pl-9 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-600"
                            />
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 max-h-140 overflow-y-auto">
                        {filteredJournals.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <span className="text-3xl block mb-2">📖</span>
                                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                                    {searchQuery
                                        ? 'Tidak ada jurnal yang cocok dengan pencarianmu'
                                        : 'Belum ada tulisan jurnal'}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Mulai tulis refleksi pertamamu di ruang aman ini.
                                </p>
                            </div>
                        ) : (
                            filteredJournals.map((entry) => {
                                const dateFormatted = new Date(
                                    entry.created_at
                                ).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                })
                                const timeFormatted = new Date(
                                    entry.created_at
                                ).toLocaleTimeString('id-ID', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })

                                return (
                                    <article
                                        key={entry.id}
                                        className="group p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-purple-300 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setActiveReadingEntry(entry)}
                                                className="text-left flex-1 cursor-pointer"
                                            >
                                                <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-1">
                                                    {entry.title || 'Catatan Refleksi'}
                                                </h3>
                                                <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {dateFormatted}
                                                    <span>•</span>
                                                    <Clock className="w-3 h-3" />
                                                    {timeFormatted}
                                                </p>
                                            </button>

                                            <div className="flex items-center gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveReadingEntry(entry)}
                                                    className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-xl transition cursor-pointer"
                                                    title="Baca selengkapnya"
                                                >
                                                    <BookOpen className="w-4 h-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(entry.id)}
                                                    disabled={deletingId === entry.id}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                                    title="Hapus jurnal"
                                                >
                                                    {deletingId === entry.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {(entry.prompt_used || entry.prompt) && (
                                            <p className="mt-2 text-[11px] text-purple-700 bg-purple-50/80 px-2.5 py-1 rounded-lg italic line-clamp-1">
                                                “{entry.prompt_used || entry.prompt}”
                                            </p>
                                        )}

                                        <p
                                            onClick={() => setActiveReadingEntry(entry)}
                                            className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed cursor-pointer"
                                        >
                                            {entry.content}
                                        </p>
                                    </article>
                                )
                            })
                        )}
                    </div>
                </section>
            </div>

            {/* MOBILE & DESKTOP READING SHEET / MODAL UNTUK MEMBACA JURNAL PENUH */}
            {activeReadingEntry && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setActiveReadingEntry(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="animate-fade-up bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[85dvh] flex flex-col"
                    >
                        {/* Drag Handle ala Mobile Bottom Sheet */}
                        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3" />

                        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                            <div>
                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                    {new Date(activeReadingEntry.created_at).toLocaleDateString(
                                        'id-ID',
                                        {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        }
                                    )}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                                    {activeReadingEntry.title || 'Catatan Refleksi'}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveReadingEntry(null)}
                                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-4">
                            {(activeReadingEntry.prompt_used ||
                                activeReadingEntry.prompt) && (
                                    <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 italic">
                                        “
                                        {activeReadingEntry.prompt_used || activeReadingEntry.prompt}
                                        ”
                                    </div>
                                )}

                            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                {activeReadingEntry.content}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}