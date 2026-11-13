'use client'

import { useState, useMemo } from 'react'
import {
    GraduationCap,
    Search,
    BookOpen,
    Clock,
    Sparkles,
    CheckCircle2,
    Bookmark,
    X,
    HeartHandshake,
    ChevronRight,
    Layers,
} from 'lucide-react'

const CATEGORY_THEMES: Record<
    string,
    { badge: string; gradient: string; iconBg: string }
> = {
    'Regulasi Emosi': {
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
        gradient: 'from-purple-500/10 to-indigo-500/5',
        iconBg: 'bg-purple-100 text-purple-700',
    },
    'Self-Care': {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        gradient: 'from-emerald-500/10 to-teal-500/5',
        iconBg: 'bg-emerald-100 text-emerald-700',
    },
    Mindfulness: {
        badge: 'bg-sky-100 text-sky-700 border-sky-200',
        gradient: 'from-sky-500/10 to-blue-500/5',
        iconBg: 'bg-sky-100 text-sky-700',
    },
    'Manajemen Stres': {
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        gradient: 'from-amber-500/10 to-orange-500/5',
        iconBg: 'bg-amber-100 text-amber-700',
    },
}

interface ClientLearnProps {
    contents?: any[]
    initialContents?: any[]
    articles?: any[]
}

export default function ClientLearn({
    contents,
    initialContents,
    articles,
}: ClientLearnProps) {
    const articleList = contents ?? initialContents ?? articles ?? []

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
    const [readIds, setReadIds] = useState<Set<string>>(new Set())
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())

    // Ambil daftar kategori unik dari data
    const categories = useMemo(() => {
        const uniqueCats = Array.from(
            new Set(
                articleList
                    .map((item) => item.category)
                    .filter((cat): cat is string => Boolean(cat))
            )
        )
        return ['Semua', ...uniqueCats]
    }, [articleList])

    // Filter artikel berdasarkan kategori & pencarian
    const filteredArticles = useMemo(() => {
        return articleList.filter((item) => {
            const matchesCat =
                selectedCategory === 'Semua' ||
                (selectedCategory === 'Tersimpan'
                    ? bookmarkedIds.has(item.id)
                    : item.category === selectedCategory)

            if (!matchesCat) return false
            if (!searchQuery.trim()) return true

            const q = searchQuery.toLowerCase()
            return (
                String(item.title || '')
                    .toLowerCase()
                    .includes(q) ||
                String(item.summary || item.description || '')
                    .toLowerCase()
                    .includes(q) ||
                String(item.content || '')
                    .toLowerCase()
                    .includes(q)
            )
        })
    }, [articleList, selectedCategory, searchQuery, bookmarkedIds])

    // Hitung estimasi waktu baca (rata-rata 180 kata/menit)
    function getReadingTime(text: string) {
        const words = String(text || '')
            .trim()
            .split(/\s+/).length
        const minutes = Math.max(1, Math.ceil(words / 180))
        return `${minutes} mnt baca`
    }

    function handleOpenArticle(article: any) {
        setSelectedArticle(article)
        setReadIds((prev) => new Set(prev).add(article.id))
    }

    function toggleBookmark(id: string, e?: React.MouseEvent) {
        if (e) e.stopPropagation()
        setBookmarkedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE HEADER BANNER */}
            <header className="bg-linear-to-br from-sky-700 via-indigo-700 to-purple-800 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-indigo-950/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-sky-100 mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> Psychoeducation & Gentle Guides
                        </span>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                            Mind Learn
                        </h1>
                        <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-md leading-relaxed">
                            Bacaan ringan, hangat, dan mudah dipahami untuk menemanimu mengenali cara kerja pikiran dan emosi.
                        </p>
                    </div>

                    {/* Mini App Status Pills */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-sky-200 font-semibold">
                                Materi
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {articleList.length}
                            </p>
                        </div>

                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-sky-200 font-semibold">
                                Dibaca
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {readIds.size}
                            </p>
                        </div>

                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-sky-200 font-semibold">
                                Disimpan
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {bookmarkedIds.size}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* SEARCH BAR & KATEGORI FILTER */}
            <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3.5">
                {/* Search Input */}
                <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari topik bacaan (misal: cemas, burnout, bernapas, istirahat)..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 text-slate-900 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                    />
                </div>

                {/* Category Pills (Wrap rapi tanpa scrollbar mengganggu) */}
                <div className="flex flex-wrap items-center gap-1.5">
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${isActive
                                        ? 'bg-purple-700 text-white shadow-xs'
                                        : 'bg-slate-100/80 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                                    }`}
                            >
                                {cat}
                            </button>
                        )
                    })}

                    <button
                        type="button"
                        onClick={() => setSelectedCategory('Tersimpan')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 inline-flex items-center gap-1 ${selectedCategory === 'Tersimpan'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                            }`}
                    >
                        <Bookmark className="w-3 h-3" /> Tersimpan ({bookmarkedIds.size})
                    </button>
                </div>
            </div>

            {/* DAFTAR KARTU MATERI EDUKASI */}
            {filteredArticles.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center">
                    <span className="text-3xl block mb-2">📚</span>
                    <p className="text-sm font-bold text-slate-800">
                        {searchQuery || selectedCategory !== 'Semua'
                            ? 'Belum ada materi yang sesuai dengan filter ini'
                            : 'Materi edukasi sedang disiapkan'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Coba gunakan kata kunci lain atau pilih kategori &ldquo;Semua&rdquo;.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                    {filteredArticles.map((article) => {
                        const catName = article.category || 'Regulasi Emosi'
                        const theme =
                            CATEGORY_THEMES[catName] || CATEGORY_THEMES['Regulasi Emosi']
                        const isRead = readIds.has(article.id)
                        const isBookmarked = bookmarkedIds.has(article.id)
                        const summaryText =
                            article.summary ||
                            article.description ||
                            String(article.content || '').slice(0, 130) + '...'

                        return (
                            <article
                                key={article.id}
                                onClick={() => handleOpenArticle(article)}
                                className="group bg-white border border-slate-200/90 rounded-3xl p-5 shadow-2xs hover:shadow-md hover:border-purple-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top Meta Row */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span
                                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}
                                            >
                                                {catName}
                                            </span>
                                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                <Clock className="w-3 h-3" />
                                                {getReadingTime(article.content)}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => toggleBookmark(article.id, e)}
                                            className={`p-2 rounded-xl transition cursor-pointer active:scale-90 ${isBookmarked
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : 'bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                                }`}
                                            title={
                                                isBookmarked ? 'Hapus dari tersimpan' : 'Simpan bacaan'
                                            }
                                        >
                                            <Bookmark
                                                className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`}
                                            />
                                        </button>
                                    </div>

                                    {/* Title & Summary */}
                                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">
                                        {article.title}
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                                        {summaryText}
                                    </p>
                                </div>

                                {/* Card Footer */}
                                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                    {isRead ? (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Sudah dibaca
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                                            <BookOpen className="w-3.5 h-3.5" /> Ketuk untuk membaca
                                        </span>
                                    )}

                                    <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 group-hover:translate-x-0.5 transition-transform">
                                        Baca Materi <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}

            {/* DISCLAIMER EDUKASI RINGAN */}
            <div className="bg-purple-50/70 border border-purple-200/70 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
                <HeartHandshake className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    Seluruh materi di <strong>Mind Learn</strong> disusun sebagai wawasan reflektif dan edukasi mandiri, bukan pengganti konsultasi psikolog atau psikiater profesional.
                </p>
            </div>

            {/* MOBILE BOTTOM SHEET / MODAL BACA ARTIKEL PENUH */}
            {selectedArticle && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setSelectedArticle(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="animate-fade-up bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[88dvh] flex flex-col"
                    >
                        {/* Drag Handle Mobile */}
                        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 shrink-0" />

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3 shrink-0">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200/70">
                                        {selectedArticle.category || 'Edukasi Mental'}
                                    </span>
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {getReadingTime(selectedArticle.content)}
                                    </span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2 leading-snug">
                                    {selectedArticle.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => toggleBookmark(selectedArticle.id)}
                                    className={`p-2 rounded-xl transition cursor-pointer ${bookmarkedIds.has(selectedArticle.id)
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-amber-50'
                                        }`}
                                    title="Simpan bacaan"
                                >
                                    <Bookmark
                                        className={`w-4 h-4 ${bookmarkedIds.has(selectedArticle.id) ? 'fill-current' : ''
                                            }`}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedArticle(null)}
                                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-4">
                            {(selectedArticle.summary || selectedArticle.description) && (
                                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs sm:text-sm text-sky-950 font-medium leading-relaxed">
                                    {selectedArticle.summary || selectedArticle.description}
                                </div>
                            )}

                            <div className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed space-y-3">
                                {selectedArticle.content}
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                                    <CheckCircle2 className="w-4 h-4" /> Materi ditandai telah dibaca
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setSelectedArticle(null)}
                                    className="px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition cursor-pointer active:scale-95"
                                >
                                    Selesai Membaca
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}