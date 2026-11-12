'use client'

import { useState } from 'react'
import { toggleCompleteContent } from './actions'
import {
    GraduationCap,
    BookOpen,
    CheckCircle2,
    Circle,
    Loader2,
    X,
    Search,
} from 'lucide-react'

export default function ClientLearn({
    contents,
    completedIds,
}: {
    contents: any[]
    completedIds: string[]
}) {
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeArticle, setActiveArticle] = useState<any | null>(null)
    const [loadingId, setLoadingId] = useState<string | null>(null)

    const categories = ['Semua', ...Array.from(new Set(contents.map((c) => c.category)))]

    const filteredContents = contents.filter((item) => {
        const matchCategory = selectedCategory === 'Semua' || item.category === selectedCategory
        const matchSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.content.toLowerCase().includes(searchQuery.toLowerCase())
        return matchCategory && matchSearch
    })

    async function handleToggleComplete(contentId: string) {
        const isCompleted = completedIds.includes(contentId)
        setLoadingId(contentId)
        await toggleCompleteContent(contentId, isCompleted)
        setLoadingId(null)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* RINGKASAN PROGRES */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Progres Pemahamanmu</h2>
                        <p className="text-xs text-slate-500">
                            Kamu telah menyelesaikan {completedIds.length} dari {contents.length} materi edukasi
                        </p>
                    </div>
                </div>

                <div className="w-full sm:w-48">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Selesai</span>
                        <span>
                            {contents.length > 0 ? Math.round((completedIds.length / contents.length) * 100) : 0}%
                        </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{
                                width: `${contents.length > 0 ? (completedIds.length / contents.length) * 100 : 0}%`,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* CARD UTAMA: FILTER & DAFTAR MATERI */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar Filter & Pencarian */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex flex-wrap gap-1.5">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${selectedCategory === cat
                                        ? 'bg-purple-700 text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full lg:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari topik materi..."
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                        />
                    </div>
                </div>

                {/* Grid Materi */}
                <div className="p-6">
                    {filteredContents.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            Belum ada materi ditemukan. Pastikan SQL seed data sudah dijalankan di Supabase.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {filteredContents.map((item) => {
                                const isDone = completedIds.includes(item.id)
                                return (
                                    <div
                                        key={item.id}
                                        className={`border rounded-2xl p-5 flex flex-col justify-between transition ${isDone
                                                ? 'border-emerald-200 bg-emerald-50/20'
                                                : 'border-slate-200/90 bg-white hover:border-purple-200'
                                            }`}
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700">
                                                    {item.category}
                                                </span>
                                                {isDone && (
                                                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                        <CheckCircle2 className="w-4 h-4" /> Selesai Dibaca
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="font-bold text-slate-800 text-base mb-2">{item.title}</h3>
                                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-5">
                                                {item.content}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                                            <button
                                                onClick={() => setActiveArticle(item)}
                                                className="flex-1 py-2 px-3 bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                                            >
                                                <BookOpen className="w-4 h-4" /> Baca Materi
                                            </button>

                                            <button
                                                onClick={() => handleToggleComplete(item.id)}
                                                disabled={loadingId === item.id}
                                                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${isDone
                                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                    }`}
                                                title={isDone ? 'Batalkan status selesai' : 'Tandai selesai dibaca'}
                                            >
                                                {loadingId === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : isDone ? (
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                                ) : (
                                                    <Circle className="w-4 h-4" />
                                                )}
                                                {isDone ? 'Selesai' : 'Tandai'}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL BACA ARTIKEL LENGKAP */}
            {activeArticle && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-xl border border-slate-200 overflow-hidden">
                        {/* Header Modal */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                                {activeArticle.category}
                            </span>
                            <button
                                onClick={() => setActiveArticle(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Isi Artikel */}
                        <div className="p-6 overflow-y-auto space-y-4">
                            <h2 className="text-xl font-bold text-slate-800 leading-snug">
                                {activeArticle.title}
                            </h2>
                            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                                {activeArticle.content}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
                            <button
                                onClick={() => setActiveArticle(null)}
                                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                            >
                                Tutup
                            </button>

                            <button
                                onClick={() => handleToggleComplete(activeArticle.id)}
                                disabled={loadingId === activeArticle.id}
                                className={`px-5 py-2 text-xs font-semibold rounded-xl transition flex items-center gap-2 cursor-pointer ${completedIds.includes(activeArticle.id)
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                        : 'bg-purple-700 text-white hover:bg-purple-800'
                                    }`}
                            >
                                {loadingId === activeArticle.id ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <CheckCircle2 className="w-4 h-4" />
                                )}
                                {completedIds.includes(activeArticle.id)
                                    ? 'Sudah Selesai Dibaca'
                                    : 'Tandai Selesai Dibaca'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}