'use client'

import { useState } from 'react'
// Sesuaikan nama fungsi import berikut dengan yang ada di ./actions.ts
import { completeMission } from './actions'
import {
    Target,
    Sparkles,
    CheckCircle2,
    Circle,
    Clock,
    HeartHandshake,
    Loader2,
    X,
    Leaf,
    Sun,
    Wind,
    BookOpen,
} from 'lucide-react'

const CATEGORY_STYLES: Record<
    string,
    { badge: string; icon: any; accent: string }
> = {
    Mindfulness: {
        badge: 'bg-purple-100 text-purple-700 border-purple-200',
        icon: Wind,
        accent: 'text-purple-700 bg-purple-50',
    },
    Fisik: {
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        icon: Leaf,
        accent: 'text-emerald-700 bg-emerald-50',
    },
    Refleksi: {
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: BookOpen,
        accent: 'text-amber-700 bg-amber-50',
    },
    Sosial: {
        badge: 'bg-sky-100 text-sky-700 border-sky-200',
        icon: Sun,
        accent: 'text-sky-700 bg-sky-50',
    },
}

interface ClientQuestProps {
    missions?: any[]
    initialMissions?: any[]
    userMissions?: any[]
    completedIds?: string[]
    completedHistory?: any[]
}

export default function ClientQuest({
    missions,
    initialMissions,
    userMissions = [],
    completedIds = [],
    completedHistory = [],
}: ClientQuestProps) {
    const missionList = missions ?? initialMissions ?? []

    const initialCompletedSet = new Set<string>([
        ...completedIds,
        ...completedHistory.map((item) => item.mission_id || item.id),
        ...userMissions
            .filter((um) => um.is_completed || um.completed_at)
            .map((um) => um.mission_id || um.id),
        ...missionList.filter((m) => m.is_completed).map((m) => m.id),
    ])

    const [completedSet, setCompletedSet] =
        useState<Set<string>>(initialCompletedSet)
    const [activeFilter, setActiveFilter] = useState<'semua' | 'belum' | 'selesai'>(
        'semua'
    )
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [selectedMission, setSelectedMission] = useState<any | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const totalMissions = missionList.length
    const completedCount = missionList.filter((m) => completedSet.has(m.id)).length
    const completionPercent =
        totalMissions > 0 ? Math.round((completedCount / totalMissions) * 100) : 0

    const filteredMissions = missionList.filter((item) => {
        const isDone = completedSet.has(item.id)
        if (activeFilter === 'belum') return !isDone
        if (activeFilter === 'selesai') return isDone
        return true
    })

    async function handleToggle(mission: any) {
        const isCurrentlyDone = completedSet.has(mission.id)
        setLoadingId(mission.id)

        // Optimistic UI update agar terasa instan seperti mobile app
        const nextSet = new Set(completedSet)
        if (isCurrentlyDone) {
            nextSet.delete(mission.id)
        } else {
            nextSet.add(mission.id)
        }
        setCompletedSet(nextSet)

        try {
            const res = await completeMission(mission.id)
            if (res?.error) {
                // Kembalikan state jika gagal
                setCompletedSet(completedSet)
                alert(res.error)
            } else if (!isCurrentlyDone) {
                setToastMessage(
                    'Apresiasi untuk dirimu! Satu langkah kecil merawat diri selesai.'
                )
                setTimeout(() => setToastMessage(null), 3500)
            }
        } catch {
            setCompletedSet(completedSet)
        } finally {
            setLoadingId(null)
        }
    }

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE HEADER BANNER */}
            <header className="bg-linear-to-br from-amber-600 via-orange-600 to-purple-800 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-amber-950/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-amber-100 mb-2">
                            <HeartHandshake className="w-3.5 h-3.5" /> Gentle Self-Care • Tanpa Target Paksa
                        </span>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                            Mood Quest
                        </h1>
                        <p className="text-xs sm:text-sm text-amber-50/90 mt-1 max-w-md leading-relaxed">
                            Pilih aktivitas kecil yang paling nyaman untukmu hari ini. Tidak ada poin, peringkat, atau keharusan menyelesaikan semuanya.
                        </p>
                    </div>

                    {/* App Progress Summary Card */}
                    <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-2xl p-4 sm:min-w-52 shrink-0">
                        <div className="flex items-center justify-between text-xs font-semibold text-amber-100">
                            <span>Langkah Hari Ini</span>
                            <span>
                                {completedCount} / {totalMissions}
                            </span>
                        </div>
                        <div className="mt-2 w-full h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${completionPercent}%` }}
                            />
                        </div>
                        <p className="text-[11px] text-amber-100/90 mt-2">
                            {completedCount === 0
                                ? 'Mulai dari satu hal paling ringan.'
                                : 'Setiap langkah kecilmu sangat berarti.'}
                        </p>
                    </div>
                </div>
            </header>

            {/* TOAST APRESIASI ALA MOBILE APP */}
            {toastMessage && (
                <div className="animate-fade-up bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg flex items-center justify-between text-xs sm:text-sm font-semibold">
                    <span className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0" />
                        {toastMessage}
                    </span>
                </div>
            )}

            {/* FILTER BAR RAPI (TANPA SCROLL SAMPING BERLEBIHAN) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-slate-200/80 rounded-2xl p-3 sm:px-5 shadow-2xs">
                <div className="grid grid-cols-3 sm:flex items-center gap-1.5">
                    {[
                        { id: 'semua', label: `Semua (${totalMissions})` },
                        {
                            id: 'belum',
                            label: `Tersedia (${totalMissions - completedCount})`,
                        },
                        { id: 'selesai', label: `Selesai (${completedCount})` },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveFilter(tab.id as any)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${activeFilter === tab.id
                                ? 'bg-purple-700 text-white shadow-xs'
                                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <p className="text-[11px] text-slate-500 hidden md:block">
                    Ketuk kartu untuk melihat panduan langkah aktivitas
                </p>
            </div>

            {/* DAFTAR KARTU AKTIVITAS MOOD QUEST */}
            {filteredMissions.length === 0 ? (
                <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center">
                    <span className="text-3xl block mb-2">🌿</span>
                    <p className="text-sm font-bold text-slate-800">
                        {activeFilter === 'selesai'
                            ? 'Belum ada aktivitas yang ditandai selesai'
                            : 'Semua aktivitas pada daftar ini sudah kamu lakukan'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                        Kamu bebas memilih aktivitas mana pun kapan saja kamu siap.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredMissions.map((mission) => {
                        const isDone = completedSet.has(mission.id)
                        const isLoading = loadingId === mission.id
                        const catName = mission.category || 'Mindfulness'
                        const catStyle =
                            CATEGORY_STYLES[catName] || CATEGORY_STYLES.Mindfulness
                        const CategoryIcon = catStyle.icon

                        return (
                            <div
                                key={mission.id}
                                className={`group rounded-3xl border p-4 sm:p-5 transition-all duration-300 flex items-start gap-3.5 ${isDone
                                    ? 'bg-emerald-50/40 border-emerald-200/90'
                                    : 'bg-white border-slate-200/90 hover:border-purple-300 hover:shadow-sm'
                                    }`}
                            >
                                {/* Tombol Centang Besar & Nyaman Disentuh Jari */}
                                <button
                                    type="button"
                                    onClick={() => handleToggle(mission)}
                                    disabled={isLoading}
                                    className={`mt-0.5 p-2 rounded-2xl transition-all cursor-pointer active:scale-90 shrink-0 ${isDone
                                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                                        : 'bg-slate-100 text-slate-400 hover:bg-purple-100 hover:text-purple-700'
                                        }`}
                                    title={
                                        isDone ? 'Tandai belum selesai' : 'Tandai sudah dilakukan'
                                    }
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isDone ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </button>

                                {/* Konten Kartu */}
                                <div
                                    onClick={() => setSelectedMission(mission)}
                                    className="flex-1 min-w-0 cursor-pointer"
                                >
                                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${catStyle.badge}`}
                                        >
                                            <CategoryIcon className="w-3 h-3" />
                                            {catName}
                                        </span>

                                        {mission.duration && (
                                            <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                                                <Clock className="w-3 h-3" />
                                                {mission.duration}
                                            </span>
                                        )}
                                    </div>

                                    <h3
                                        className={`text-sm sm:text-base font-bold transition-colors ${isDone
                                            ? 'text-emerald-950 line-through decoration-emerald-500/50'
                                            : 'text-slate-800 group-hover:text-purple-700'
                                            }`}
                                    >
                                        {mission.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                                        {mission.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* MOBILE BOTTOM SHEET / MODAL DETAIL PANDUAN AKTIVITAS */}
            {selectedMission && (
                <div
                    className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
                    onClick={() => setSelectedMission(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="animate-fade-up bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Drag Handle Mobile */}
                        <div className="sm:hidden w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3" />

                        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-3">
                            <div>
                                <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/70">
                                    {selectedMission.category || 'Aktivitas Self-Care'}
                                </span>
                                <h3 className="text-lg font-bold text-slate-900 mt-1.5">
                                    {selectedMission.title}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedMission(null)}
                                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {selectedMission.description}
                            </p>

                            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 text-xs text-purple-900 leading-relaxed">
                                <strong>Tips Lembut:</strong> Lakukan perlahan sesuai kenyamanan tubuh dan pikiranmu. Jika hari ini terasa berat, cukup lakukan bagian paling sederhananya saja.
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    handleToggle(selectedMission)
                                    setSelectedMission(null)
                                }}
                                className={`w-full py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${completedSet.has(selectedMission.id)
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    : 'bg-purple-700 text-white hover:bg-purple-800 shadow-md shadow-purple-700/20'
                                    }`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                {completedSet.has(selectedMission.id)
                                    ? 'Batalkan Status Selesai'
                                    : 'Tandai Sudah Dilakukan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}