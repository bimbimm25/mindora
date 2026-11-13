'use client'

import { useRef, useState } from 'react'
import { saveMood, deleteMood } from './actions'
import {
    SmilePlus,
    RotateCcw,
    Save,
    Loader2,
    Calendar,
    Trash2,
    Sparkles,
    Activity,
    Clock,
    CheckCircle2,
    Filter,
} from 'lucide-react'

const MOOD_OPTIONS = [
    {
        value: 'Bahagia',
        emoji: '😊',
        label: 'Bahagia',
        desc: 'Hangat, bersemangat, & bersyukur',
        activeCard:
            'bg-amber-50/90 border-amber-400 text-amber-950 ring-2 ring-amber-400/30 shadow-sm',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        barColor: 'bg-amber-400',
    },
    {
        value: 'Tenang',
        emoji: '🌿',
        label: 'Tenang',
        desc: 'Damai, stabil, & cukup lapang',
        activeCard:
            'bg-emerald-50/90 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/30 shadow-sm',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        barColor: 'bg-emerald-500',
    },
    {
        value: 'Lelah',
        emoji: '🥱',
        label: 'Lelah',
        desc: 'Energi terkuras & butuh jeda',
        activeCard:
            'bg-slate-100/90 border-slate-400 text-slate-900 ring-2 ring-slate-400/30 shadow-sm',
        badge: 'bg-slate-200/80 text-slate-800 border-slate-300',
        barColor: 'bg-slate-500',
    },
    {
        value: 'Cemas',
        emoji: '😰',
        label: 'Cemas',
        desc: 'Gelisah, overthinking, & tegang',
        activeCard:
            'bg-purple-50/90 border-purple-400 text-purple-950 ring-2 ring-purple-400/30 shadow-sm',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        barColor: 'bg-purple-600',
    },
    {
        value: 'Sedih',
        emoji: '😢',
        label: 'Sedih',
        desc: 'Murung, kecewa, atau kehilangan',
        activeCard:
            'bg-sky-50/90 border-sky-400 text-sky-950 ring-2 ring-sky-400/30 shadow-sm',
        badge: 'bg-sky-100 text-sky-800 border-sky-200',
        barColor: 'bg-sky-500',
    },
    {
        value: 'Marah',
        emoji: '😠',
        label: 'Marah',
        desc: 'Kesal, tertekan, atau frustrasi',
        activeCard:
            'bg-rose-50/90 border-rose-400 text-rose-950 ring-2 ring-rose-400/30 shadow-sm',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        barColor: 'bg-rose-500',
    },
]

const INTENSITY_LABELS: Record<number, { title: string; hint: string }> = {
    1: { title: 'Sangat Ringan', hint: 'Terasa samar di latar belakang' },
    2: { title: 'Ringan', hint: 'Cukup terasa namun mudah dikelola' },
    3: { title: 'Sedang', hint: 'Cukup memengaruhi fokus & harimu' },
    4: { title: 'Kuat', hint: 'Terasa dominan & menyita perhatian' },
    5: { title: 'Sangat Kuat', hint: 'Sangat intens, butuh ruang bernapas' },
}

const QUICK_TAGS = [
    'Pekerjaan / Kuliah',
    'Istirahat & Tidur',
    'Keluarga / Pasangan',
    'Kesehatan Fisik',
    'Waktu Sendiri',
    'Keuangan',
]

export default function ClientTracker({
    historyData = [],
}: {
    historyData?: any[]
}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [selectedMood, setSelectedMood] = useState<string>('Tenang')
    const [intensity, setIntensity] = useState<number>(3)
    const [noteText, setNoteText] = useState<string>('')
    const [filterMood, setFilterMood] = useState<string>('Semua')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [toastSuccess, setToastSuccess] = useState(false)

    const activeMoodObj =
        MOOD_OPTIONS.find((m) => m.value === selectedMood) || MOOD_OPTIONS[1]

    const totalEntries = historyData.length
    const latestEntry = historyData[0]
    const avgIntensity =
        totalEntries > 0
            ? (
                historyData.reduce(
                    (acc, item) => acc + (Number(item.intensity) || 0),
                    0
                ) / totalEntries
            ).toFixed(1)
            : '0.0'

    const filteredEntries =
        filterMood === 'Semua'
            ? historyData
            : historyData.filter((item) => item.mood_type === filterMood)

    function handleAppendTag(tag: string) {
        setNoteText((prev) => {
            if (prev.includes(`#${tag}`)) return prev
            return prev.trim() ? `${prev.trim()} • #${tag}` : `#${tag} `
        })
    }

    function handleReset() {
        setSelectedMood('Tenang')
        setIntensity(3)
        setNoteText('')
    }

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        setToastSuccess(false)
        const res = await saveMood(formData)
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
        if (!confirm('Hapus catatan suasana hati ini?')) return
        setDeletingId(id)
        await deleteMood(id)
        setDeletingId(null)
    }

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE HEADER BANNER */}
            <header className="bg-linear-to-br from-purple-700 via-purple-700 to-indigo-800 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-purple-900/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-purple-100 mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> Daily Emotional Check-In
                        </span>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                            Mind Tracker
                        </h1>
                        <p className="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-md leading-relaxed">
                            Luangkan sejenak untuk mengenali perasaanmu tanpa menghakimi.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">
                                Check-in
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {totalEntries}x
                            </p>
                        </div>

                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">
                                Intensitas
                            </p>
                            <p className="text-base sm:text-lg font-extrabold mt-0.5">
                                {avgIntensity}/5
                            </p>
                        </div>

                        <div className="bg-white/12 backdrop-blur-xs border border-white/15 rounded-2xl px-3 py-2.5 text-center">
                            <p className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">
                                Terakhir
                            </p>
                            <p className="text-xs sm:text-sm font-bold mt-1 truncate">
                                {latestEntry ? latestEntry.mood_type : '-'}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {/* NOTIFIKASI SUKSES ALA MOBILE TOAST */}
            {toastSuccess && (
                <div className="animate-fade-up bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Perasaanmu berhasil dicatat dengan aman!
                    </span>
                    <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-lg">
                        Tersimpan
                    </span>
                </div>
            )}

            {/* GRID UTAMA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* KOLOM KIRI: KARTU CHECK-IN SUASANA HATI */}
                <form
                    ref={formRef}
                    action={handleSubmit}
                    className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden"
                >
                    {/* Nama input disesuaikan dengan actions.ts: mood_type & intensity */}
                    <input type="hidden" name="mood_type" value={selectedMood} />
                    <input type="hidden" name="intensity" value={intensity} />

                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                                <SmilePlus className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    Check-in Sekarang
                                </h2>
                                <p className="text-[11px] text-slate-500">
                                    Pilih emosi yang paling menggambarkan kondisimu
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="p-2 sm:px-3.5 sm:py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                                title="Reset Form"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Reset</span>
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition shadow-sm shadow-purple-700/20 flex items-center gap-1.5 disabled:opacity-60 cursor-pointer active:scale-95"
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

                    <div className="p-5 sm:p-6 space-y-6">
                        {/* 1. PILIHAN SUASANA HATI */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    1. Apa yang kamu rasakan?
                                </label>
                                <span
                                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${activeMoodObj.badge}`}
                                >
                                    {activeMoodObj.emoji} {activeMoodObj.label}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                                {MOOD_OPTIONS.map((item) => {
                                    const isSelected = selectedMood === item.value
                                    return (
                                        <button
                                            key={item.value}
                                            type="button"
                                            onClick={() => setSelectedMood(item.value)}
                                            className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer active:scale-95 flex flex-col justify-between ${isSelected
                                                ? `${item.activeCard} -translate-y-0.5`
                                                : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50/80 hover:border-slate-300'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between w-full mb-1.5">
                                                <span className="text-2xl sm:text-3xl">{item.emoji}</span>
                                                <span
                                                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${isSelected
                                                        ? 'border-purple-700 bg-purple-700'
                                                        : 'border-slate-300'
                                                        }`}
                                                >
                                                    {isSelected && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                                    )}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm font-bold leading-tight">
                                                    {item.label}
                                                </p>
                                                <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        {/* 2. TINGKAT INTENSITAS */}
                        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-purple-700" />
                                    2. Seberapa kuat rasanya?
                                </label>
                                <span className="text-xs font-extrabold text-purple-700">
                                    {intensity} / 5 • {INTENSITY_LABELS[intensity].title}
                                </span>
                            </div>

                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((level) => {
                                    const isSelected = intensity === level
                                    return (
                                        <button
                                            key={level}
                                            type="button"
                                            onClick={() => setIntensity(level)}
                                            className={`py-2.5 rounded-xl font-extrabold text-sm transition-all duration-200 cursor-pointer active:scale-90 ${isSelected
                                                ? 'bg-purple-700 text-white shadow-md shadow-purple-700/20 -translate-y-0.5'
                                                : 'bg-white text-slate-600 border border-slate-200 hover:border-purple-300'
                                                }`}
                                        >
                                            {level}
                                        </button>
                                    )
                                })}
                            </div>

                            <p className="text-[11px] text-slate-500 text-center">
                                {INTENSITY_LABELS[intensity].hint}
                            </p>
                        </div>

                        {/* 3. PEMICU CEPAT & CATATAN SINGKAT */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                                3. Pemicu & Catatan Singkat (Opsional)
                            </label>

                            <div className="flex flex-wrap gap-1.5">
                                {QUICK_TAGS.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleAppendTag(tag)}
                                        className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-purple-50/80 text-purple-700 border border-purple-200/70 hover:bg-purple-100 transition cursor-pointer active:scale-95"
                                    >
                                        + {tag}
                                    </button>
                                ))}
                            </div>

                            {/* Nama textarea disesuaikan dengan actions.ts: notes */}
                            <textarea
                                name="notes"
                                rows={3}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Ceritakan sedikit apa yang sedang terjadi atau memengaruhi perasaanmu hari ini..."
                                className="w-full p-3.5 bg-white text-slate-900 border border-slate-200 rounded-2xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none leading-relaxed"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:hidden py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-2xl shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-60"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Simpan Check-in Suasana Hati
                        </button>
                    </div>
                </form>

                {/* KOLOM KANAN: RIWAYAT TIMELINE MOOD */}
                <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-emerald-600" />
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    Riwayat Perasaan
                                </h2>
                            </div>
                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                {filteredEntries.length} catatan
                            </span>
                        </div>

                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
                            {['Semua', ...MOOD_OPTIONS.map((m) => m.value)].map((moodName) => (
                                <button
                                    key={moodName}
                                    type="button"
                                    onClick={() => setFilterMood(moodName)}
                                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${filterMood === moodName
                                        ? 'bg-slate-800 text-white'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                        }`}
                                >
                                    {moodName}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-3 max-h-135 overflow-y-auto">
                        {filteredEntries.length === 0 ? (
                            <div className="text-center py-10 px-4">
                                <span className="text-3xl block mb-2">🌱</span>
                                <p className="text-xs sm:text-sm font-semibold text-slate-700">
                                    Belum ada catatan pada kategori ini
                                </p>
                                <p className="text-xs text-slate-400 mt-1">
                                    Mulai check-in pertamamu melalui formulir di samping.
                                </p>
                            </div>
                        ) : (
                            filteredEntries.map((entry) => {
                                const moodMeta =
                                    MOOD_OPTIONS.find((m) => m.value === entry.mood_type) ||
                                    MOOD_OPTIONS[1]
                                const dateFormatted = new Date(entry.created_at).toLocaleDateString(
                                    'id-ID',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    }
                                )
                                const timeFormatted = new Date(entry.created_at).toLocaleTimeString(
                                    'id-ID',
                                    {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    }
                                )

                                return (
                                    <div
                                        key={entry.id}
                                        className="group p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-purple-200 transition-all"
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-2xl shadow-2xs shrink-0">
                                                    {moodMeta.emoji}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-bold text-slate-800">
                                                            {entry.mood_type}
                                                        </span>
                                                        <span
                                                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${moodMeta.badge}`}
                                                        >
                                                            Level {entry.intensity}/5
                                                        </span>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {dateFormatted} • {timeFormatted}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleDelete(entry.id)}
                                                disabled={deletingId === entry.id}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                                                title="Hapus catatan"
                                            >
                                                {deletingId === entry.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        <div className="mt-3 w-full h-1.5 bg-slate-200/70 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${moodMeta.barColor}`}
                                                style={{ width: `${(Number(entry.intensity) / 5) * 100}%` }}
                                            />
                                        </div>

                                        {entry.notes && (
                                            <p className="mt-2.5 text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                                                {entry.notes}
                                            </p>
                                        )}
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}