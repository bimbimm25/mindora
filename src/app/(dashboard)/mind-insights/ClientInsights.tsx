'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
    LineChart,
    Sparkles,
    SmilePlus,
    BookHeart,
    Activity,
    TrendingUp,
    Info,
    ArrowRight,
    BarChart3,
    PieChart,
    CalendarDays,
} from 'lucide-react'

const MOOD_META: Record<
    string,
    {
        emoji: string
        barColor: string
        badge: string
        softBg: string
        cellBg: string
    }
> = {
    Bahagia: {
        emoji: '😊',
        barColor: 'bg-amber-400',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
        softBg: 'bg-amber-50/70',
        cellBg: 'bg-amber-50 border-amber-300 text-amber-950',
    },
    Tenang: {
        emoji: '🌿',
        barColor: 'bg-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        softBg: 'bg-emerald-50/70',
        cellBg: 'bg-emerald-50 border-emerald-300 text-emerald-950',
    },
    Lelah: {
        emoji: '🥱',
        barColor: 'bg-slate-400',
        badge: 'bg-slate-200/80 text-slate-800 border-slate-300',
        softBg: 'bg-slate-100/70',
        cellBg: 'bg-slate-100 border-slate-300 text-slate-900',
    },
    Cemas: {
        emoji: '😰',
        barColor: 'bg-purple-600',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
        softBg: 'bg-purple-50/70',
        cellBg: 'bg-purple-50 border-purple-300 text-purple-950',
    },
    Sedih: {
        emoji: '😢',
        barColor: 'bg-sky-500',
        badge: 'bg-sky-100 text-sky-800 border-sky-200',
        softBg: 'bg-sky-50/70',
        cellBg: 'bg-sky-50 border-sky-300 text-sky-950',
    },
    Marah: {
        emoji: '😠',
        barColor: 'bg-rose-500',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
        softBg: 'bg-rose-50/70',
        cellBg: 'bg-rose-50 border-rose-300 text-rose-950',
    },
}

interface ClientInsightsProps {
    moodEntries?: any[]
    entries?: any[]
    moods?: any[]
    journalEntries?: any[]
    journals?: any[]
}

interface ChartPoint {
    key: string
    topLabel: string
    bottomLabel: string
    fullDate: string
    fullTitle: string
    isToday: boolean
    hasData: boolean
    level: number
    moodName: string | null
    count: number
}

export default function ClientInsights({
    moodEntries,
    entries,
    moods,
    journalEntries,
    journals,
}: ClientInsightsProps) {
    const allMoods = moodEntries ?? entries ?? moods ?? []
    const allJournals = journalEntries ?? journals ?? []

    const [range, setRange] = useState<'7d' | '30d' | 'all'>('7d')
    const [selectedDayPoint, setSelectedDayPoint] = useState<ChartPoint | null>(
        null
    )

    // Helper: Mendapatkan tanggal Senin pada minggu berjalan
    function getMondayOfCurrentWeek(baseDate: Date) {
        const d = new Date(baseDate)
        d.setHours(0, 0, 0, 0)
        const day = d.getDay()
        const diffToMonday = day === 0 ? -6 : 1 - day
        d.setDate(d.getDate() + diffToMonday)
        return d
    }

    // Filter data untuk KPI & Distribusi sesuai tombol filter
    const filteredMoods = useMemo(() => {
        const now = new Date()
        if (range === 'all') return allMoods

        if (range === '7d') {
            const monday = getMondayOfCurrentWeek(now)
            const sundayEnd = new Date(monday)
            sundayEnd.setDate(monday.getDate() + 6)
            sundayEnd.setHours(23, 59, 59, 999)

            return allMoods.filter((item) => {
                const d = new Date(item.created_at)
                return d >= monday && d <= sundayEnd
            })
        }

        const cutoff = new Date(now)
        cutoff.setHours(0, 0, 0, 0)
        cutoff.setDate(cutoff.getDate() - 29)
        return allMoods.filter((item) => new Date(item.created_at) >= cutoff)
    }, [allMoods, range])

    const filteredJournals = useMemo(() => {
        const now = new Date()
        if (range === 'all') return allJournals

        if (range === '7d') {
            const monday = getMondayOfCurrentWeek(now)
            const sundayEnd = new Date(monday)
            sundayEnd.setDate(monday.getDate() + 6)
            sundayEnd.setHours(23, 59, 59, 999)

            return allJournals.filter((item) => {
                const d = new Date(item.created_at)
                return d >= monday && d <= sundayEnd
            })
        }

        const cutoff = new Date(now)
        cutoff.setHours(0, 0, 0, 0)
        cutoff.setDate(cutoff.getDate() - 29)
        return allJournals.filter((item) => new Date(item.created_at) >= cutoff)
    }, [allJournals, range])

    // Kalkulasi Analitik + Grafik Dinamis (7 Hari Senin-Minggu, Kalender 30 Hari, Semua)
    const analytics = useMemo(() => {
        const now = new Date()
        const todayKey = now.toLocaleDateString('en-CA')
        let chartSeries: ChartPoint[] = []
        let leadingEmptyCells = 0
        let chartTitle = ''
        let chartSubtitle = ''

        if (range === '7d') {
            const monday = getMondayOfCurrentWeek(now)
            const sunday = new Date(monday)
            sunday.setDate(monday.getDate() + 6)

            chartTitle = 'Grafik Mingguan (Senin – Minggu)'
            chartSubtitle = `${monday.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
            })} – ${sunday.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })}`

            chartSeries = Array.from({ length: 7 }, (_, idx) => {
                const target = new Date(monday)
                target.setDate(monday.getDate() + idx)
                const dateKey = target.toLocaleDateString('en-CA')
                const isToday = dateKey === todayKey

                const dayEntries = allMoods.filter(
                    (item) =>
                        new Date(item.created_at).toLocaleDateString('en-CA') === dateKey
                )

                const dayName = target.toLocaleDateString('id-ID', { weekday: 'short' })
                const shortDate = target.toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                })
                const fullDate = target.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })

                if (dayEntries.length === 0) {
                    return {
                        key: dateKey,
                        topLabel: isToday ? 'Hari Ini' : dayName,
                        bottomLabel: shortDate,
                        fullDate,
                        fullTitle: `${fullDate}: Belum ada catatan`,
                        isToday,
                        hasData: false,
                        level: 0,
                        moodName: null,
                        count: 0,
                    }
                }

                const latest = dayEntries[0]
                const moodName = latest.mood_type || latest.mood || 'Tenang'
                const avgLevel = Number(
                    (
                        dayEntries.reduce(
                            (acc, cur) => acc + (Number(cur.intensity) || 0),
                            0
                        ) / dayEntries.length
                    ).toFixed(1)
                )

                return {
                    key: dateKey,
                    topLabel: isToday ? 'Hari Ini' : dayName,
                    bottomLabel: shortDate,
                    fullDate,
                    fullTitle: `${fullDate}: ${moodName} (Rata-rata ${avgLevel}/5 • ${dayEntries.length} catatan)`,
                    isToday,
                    hasData: true,
                    level: avgLevel,
                    moodName,
                    count: dayEntries.length,
                }
            })
        } else if (range === '30d') {
            const start30 = new Date(now)
            start30.setHours(0, 0, 0, 0)
            start30.setDate(start30.getDate() - 29)

            // Hitung offset hari pertama agar sejajar dengan header kolom Senin - Minggu
            const firstDayOfWeek = start30.getDay() // 0 = Min, 1 = Sen, ..., 6 = Sab
            leadingEmptyCells = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

            chartTitle = 'Kalender Emosi 30 Hari Terakhir'
            chartSubtitle = `${start30.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
            })} – ${now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })}`

            chartSeries = Array.from({ length: 30 }, (_, idx) => {
                const target = new Date(start30)
                target.setDate(start30.getDate() + idx)
                const dateKey = target.toLocaleDateString('en-CA')
                const isToday = dateKey === todayKey

                const dayEntries = allMoods.filter(
                    (item) =>
                        new Date(item.created_at).toLocaleDateString('en-CA') === dateKey
                )

                const dayNum = String(target.getDate())
                const monthShort = target.toLocaleDateString('id-ID', { month: 'short' })
                const fullDate = target.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })

                if (dayEntries.length === 0) {
                    return {
                        key: dateKey,
                        topLabel: dayNum,
                        bottomLabel:
                            idx === 0 || target.getDate() === 1 ? monthShort : '',
                        fullDate,
                        fullTitle: `${fullDate}: Belum ada catatan`,
                        isToday,
                        hasData: false,
                        level: 0,
                        moodName: null,
                        count: 0,
                    }
                }

                const latest = dayEntries[0]
                const moodName = latest.mood_type || latest.mood || 'Tenang'
                const avgLevel = Number(
                    (
                        dayEntries.reduce(
                            (acc, cur) => acc + (Number(cur.intensity) || 0),
                            0
                        ) / dayEntries.length
                    ).toFixed(1)
                )

                return {
                    key: dateKey,
                    topLabel: dayNum,
                    bottomLabel:
                        idx === 0 || target.getDate() === 1 ? monthShort : '',
                    fullDate,
                    fullTitle: `${fullDate}: ${moodName} (${avgLevel}/5)`,
                    isToday,
                    hasData: true,
                    level: avgLevel,
                    moodName,
                    count: dayEntries.length,
                }
            })
        } else {
            chartTitle = 'Riwayat Seluruh Periode'
            chartSubtitle = 'Tren rata-rata intensitas pada hari yang tercatat'

            const groupedMap = new Map<string, any[]>()
                ;[...allMoods].reverse().forEach((item) => {
                    const key = new Date(item.created_at).toLocaleDateString('en-CA')
                    const existing = groupedMap.get(key) || []
                    existing.push(item)
                    groupedMap.set(key, existing)
                })

            const entriesArr = Array.from(groupedMap.entries()).slice(-10)
            chartSeries = entriesArr.map(([dateKey, items]) => {
                const d = new Date(items[0].created_at)
                const latest = items[items.length - 1]
                const moodName = latest.mood_type || latest.mood || 'Tenang'
                const avgLevel = Number(
                    (
                        items.reduce((acc, cur) => acc + (Number(cur.intensity) || 0), 0) /
                        items.length
                    ).toFixed(1)
                )
                const fullDate = d.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })

                return {
                    key: dateKey,
                    topLabel: d.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                    }),
                    bottomLabel: d.toLocaleDateString('id-ID', { year: '2-digit' }),
                    fullDate,
                    fullTitle: `${fullDate}: ${moodName} (${avgLevel}/5 • ${items.length} catatan)`,
                    isToday: dateKey === todayKey,
                    hasData: true,
                    level: avgLevel,
                    moodName,
                    count: items.length,
                }
            })
        }

        const total = filteredMoods.length
        if (total === 0) {
            return {
                total: 0,
                avgIntensity: '0.0',
                dominantMood: null as string | null,
                distribution: [] as { mood: string; count: number; percent: number }[],
                chartSeries,
                leadingEmptyCells,
                chartTitle,
                chartSubtitle,
            }
        }

        const avg = (
            filteredMoods.reduce(
                (acc, item) => acc + (Number(item.intensity) || 0),
                0
            ) / total
        ).toFixed(1)

        const counts: Record<string, number> = {}
        filteredMoods.forEach((item) => {
            const m = item.mood_type || item.mood || 'Tenang'
            counts[m] = (counts[m] || 0) + 1
        })

        const distribution = Object.entries(counts)
            .map(([mood, count]) => ({
                mood,
                count,
                percent: Math.round((count / total) * 100),
            }))
            .sort((a, b) => b.count - a.count)

        return {
            total,
            avgIntensity: avg,
            dominantMood: distribution[0]?.mood || null,
            distribution,
            chartSeries,
            leadingEmptyCells,
            chartTitle,
            chartSubtitle,
        }
    }, [filteredMoods, allMoods, range])

    const dominantMeta = analytics.dominantMood
        ? MOOD_META[analytics.dominantMood] || MOOD_META.Tenang
        : null

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE HEADER BANNER */}
            <header className="bg-linear-to-br from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-purple-950/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-purple-100 mb-2">
                            <Sparkles className="w-3.5 h-3.5" /> Personal Emotional Analytics
                        </span>
                        <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
                            Mind Insights
                        </h1>
                        <p className="text-xs sm:text-sm text-purple-100/90 mt-1 max-w-md leading-relaxed">
                            Pahami pola perasaan dan intensitas emosimu berdasarkan catatan nyata yang kamu simpan.
                        </p>
                    </div>

                    {/* Segmented Time-Range Switcher */}
                    <div className="bg-black/20 backdrop-blur-xs p-1 rounded-2xl grid grid-cols-3 sm:flex items-center gap-1 self-start sm:self-center shrink-0 border border-white/15">
                        {[
                            { id: '7d', label: '7 Hari' },
                            { id: '30d', label: '30 Hari' },
                            { id: 'all', label: 'Semua' },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setRange(tab.id as '7d' | '30d' | 'all')
                                    setSelectedDayPoint(null)
                                }}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 ${range === tab.id
                                        ? 'bg-white text-purple-800 shadow-xs'
                                        : 'text-purple-100 hover:text-white'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* 4 KARTU KPI RINGKASAN UTAMA */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Check-in Mood
                        </span>
                        <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
                            <SmilePlus className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {analytics.total}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        {range === '7d'
                            ? 'Pekan ini (Sen–Min)'
                            : range === '30d'
                                ? '30 hari terakhir'
                                : 'Total keseluruhan'}
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Mood Dominan
                        </span>
                        <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-lg sm:text-2xl font-extrabold text-slate-900 truncate">
                        {analytics.dominantMood
                            ? `${dominantMeta?.emoji} ${analytics.dominantMood}`
                            : '-'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Paling sering muncul
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Rata Intensitas
                        </span>
                        <div className="p-2 rounded-xl bg-sky-50 text-sky-700">
                            <Activity className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {analytics.avgIntensity}
                        <span className="text-sm font-semibold text-slate-400">/5</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Kedalaman emosi rata-rata
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Tulisan Jurnal
                        </span>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                            <BookHeart className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {filteredJournals.length}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Refleksi pribadi tersimpan
                    </p>
                </div>
            </section>

            {/* VISUALISASI UTAMA */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* KOLOM KIRI (7 KOLOM): GRAFIK MINGGUAN / KALENDER EMOSI 30 HARI */}
                <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                                {range === '30d' ? (
                                    <CalendarDays className="w-4 h-4" />
                                ) : (
                                    <BarChart3 className="w-4 h-4" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    {analytics.chartTitle}
                                </h2>
                                <p className="text-[11px] text-slate-500">
                                    {analytics.chartSubtitle}
                                </p>
                            </div>
                        </div>
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200/70">
                            {range === '30d' ? 'Ketuk Tanggal' : 'Skala 1–5'}
                        </span>
                    </div>

                    <div className="p-4 sm:p-6">
                        {analytics.chartSeries.length === 0 ? (
                            <div className="py-12 text-center space-y-3">
                                <LineChart className="w-8 h-8 text-purple-400 mx-auto" />
                                <p className="text-xs sm:text-sm text-slate-500">
                                    Belum ada catatan suasana hati yang tersimpan.
                                </p>
                                <Link
                                    href="/mind-tracker"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold"
                                >
                                    Catat Mood Sekarang <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        ) : range === '30d' ? (
                            /* TAMPILAN RAPI MODE 30 HARI: KALENDER MOOD HEATMAP GRID 7 KOLOM */
                            <div className="space-y-4">
                                {/* Header Nama Hari Senin - Minggu */}
                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center">
                                    {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map(
                                        (dayLabel) => (
                                            <span
                                                key={dayLabel}
                                                className="text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1"
                                            >
                                                {dayLabel}
                                            </span>
                                        )
                                    )}
                                </div>

                                {/* Grid 30 Hari Kalender */}
                                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                                    {/* Sel kosong penyejajar hari pertama */}
                                    {Array.from({ length: analytics.leadingEmptyCells }).map(
                                        (_, i) => (
                                            <div key={`empty-${i}`} className="aspect-square" />
                                        )
                                    )}

                                    {analytics.chartSeries.map((point) => {
                                        const meta = point.moodName
                                            ? MOOD_META[point.moodName] || MOOD_META.Tenang
                                            : null
                                        const isSelected = selectedDayPoint?.key === point.key

                                        return (
                                            <button
                                                key={point.key}
                                                type="button"
                                                onClick={() => setSelectedDayPoint(point)}
                                                className={`aspect-square rounded-2xl border p-1 sm:p-1.5 flex flex-col items-center justify-between transition-all cursor-pointer active:scale-90 relative ${point.hasData && meta
                                                        ? `${meta.cellBg} shadow-2xs`
                                                        : 'bg-slate-50/70 border-slate-200/70 text-slate-400 hover:bg-slate-100/80'
                                                    } ${point.isToday
                                                        ? 'ring-2 ring-purple-600 ring-offset-1'
                                                        : ''
                                                    } ${isSelected ? 'scale-105 shadow-md z-10' : ''
                                                    }`}
                                                title={point.fullTitle}
                                            >
                                                <div className="w-full flex items-center justify-between px-0.5">
                                                    <span
                                                        className={`text-[10px] sm:text-xs font-extrabold leading-none ${point.isToday ? 'text-purple-700' : ''
                                                            }`}
                                                    >
                                                        {point.topLabel}
                                                    </span>
                                                    {point.bottomLabel && (
                                                        <span className="text-[8px] font-bold uppercase text-purple-600 hidden sm:inline">
                                                            {point.bottomLabel}
                                                        </span>
                                                    )}
                                                </div>

                                                {point.hasData && meta ? (
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-sm sm:text-lg leading-none">
                                                            {meta.emoji}
                                                        </span>
                                                        <span className="text-[8px] sm:text-[9px] font-bold opacity-80 mt-0.5">
                                                            {point.level}/5
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-slate-300 mb-1">
                                                        •
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Kartu Detail Tanggal Terpilih saat diklik */}
                                {selectedDayPoint && (
                                    <div className="animate-fade-up p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3 text-xs">
                                        <div>
                                            <p className="text-slate-300 text-[11px]">
                                                {selectedDayPoint.fullDate}
                                            </p>
                                            <p className="font-bold text-sm mt-0.5">
                                                {selectedDayPoint.hasData
                                                    ? `${(
                                                        MOOD_META[selectedDayPoint.moodName || ''] ||
                                                        MOOD_META.Tenang
                                                    ).emoji
                                                    } ${selectedDayPoint.moodName} • Intensitas ${selectedDayPoint.level
                                                    }/5 (${selectedDayPoint.count} catatan)`
                                                    : 'Belum ada catatan suasana hati pada tanggal ini'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedDayPoint(null)}
                                            className="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[11px] font-semibold shrink-0 cursor-pointer"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* TAMPILAN GRAFIK BATANG UNTUK 7 HARI (SENIN-MINGGU) & SEMUA */
                            <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3 pt-4 pb-2 border-b border-slate-100">
                                {analytics.chartSeries.map((point) => {
                                    const meta = point.moodName
                                        ? MOOD_META[point.moodName] || MOOD_META.Tenang
                                        : null
                                    const heightPercent = point.hasData
                                        ? Math.min(100, Math.max(15, (point.level / 5) * 100))
                                        : 0

                                    return (
                                        <div
                                            key={point.key}
                                            className="flex-1 flex flex-col items-center h-full justify-end group min-w-0"
                                            title={point.fullTitle}
                                        >
                                            <span
                                                className={`text-[11px] font-extrabold mb-1.5 ${point.hasData ? 'text-slate-700' : 'text-slate-300'
                                                    }`}
                                            >
                                                {point.hasData ? point.level : '-'}
                                            </span>

                                            <div
                                                className={`w-full max-w-11 h-36 rounded-2xl flex items-end p-1 overflow-hidden transition-colors ${point.isToday
                                                        ? 'bg-purple-100/80 ring-1 ring-purple-300'
                                                        : 'bg-slate-100/90'
                                                    }`}
                                            >
                                                {point.hasData && meta ? (
                                                    <div
                                                        className={`w-full rounded-xl transition-all duration-500 ease-out group-hover:opacity-90 ${meta.barColor}`}
                                                        style={{ height: `${heightPercent}%` }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-1 rounded-full bg-slate-200/80 mb-0.5" />
                                                )}
                                            </div>

                                            <span className="text-base sm:text-lg mt-2 h-6 flex items-center justify-center">
                                                {point.hasData && meta ? (
                                                    meta.emoji
                                                ) : (
                                                    <span className="text-xs text-slate-300">•</span>
                                                )}
                                            </span>

                                            <div className="text-center mt-0.5 leading-tight">
                                                <p
                                                    className={`text-[10px] font-bold ${point.isToday ? 'text-purple-700' : 'text-slate-600'
                                                        }`}
                                                >
                                                    {point.topLabel}
                                                </p>
                                                {point.bottomLabel && (
                                                    <p className="text-[9px] sm:text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                                        {point.bottomLabel}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        {/* Catatan Refleksi Otomatis */}
                        <div className="mt-5 p-4 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3">
                            <Sparkles className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                            <p className="text-xs text-slate-700 leading-relaxed">
                                {analytics.total > 0 ? (
                                    <>
                                        <strong>Ringkasan Pola:</strong> Pada periode ini, emosi yang paling sering hadir adalah{' '}
                                        <strong className="text-purple-800">
                                            {analytics.dominantMood}
                                        </strong>{' '}
                                        dengan rata-rata intensitas{' '}
                                        <strong className="text-purple-800">
                                            {analytics.avgIntensity} dari 5
                                        </strong>
                                        .
                                    </>
                                ) : (
                                    <>
                                        Belum ada catatan pada rentang waktu ini.{' '}
                                        <Link
                                            href="/mind-tracker"
                                            className="font-bold text-purple-700 underline"
                                        >
                                            Isi check-in hari ini
                                        </Link>{' '}
                                        untuk mulai melihat tren harianmu.
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </section>

                {/* KOLOM KANAN (5 KOLOM): DISTRIBUSI KOMPOSISI SUASANA HATI */}
                <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                                <PieChart className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                    Komposisi Emosi
                                </h2>
                                <p className="text-[11px] text-slate-500">
                                    Proporsi suasana hati pada periode terpilih
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 space-y-3.5">
                        {analytics.distribution.length === 0 ? (
                            <div className="py-10 text-center text-xs text-slate-400">
                                Belum ada komposisi emosi pada periode ini.
                            </div>
                        ) : (
                            analytics.distribution.map((row) => {
                                const meta = MOOD_META[row.mood] || MOOD_META.Tenang
                                return (
                                    <div
                                        key={row.mood}
                                        className={`p-3.5 rounded-2xl border border-slate-100 ${meta.softBg}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{meta.emoji}</span>
                                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                                    {row.mood}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] font-semibold text-slate-500">
                                                    {row.count}x
                                                </span>
                                                <span
                                                    className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border ${meta.badge}`}
                                                >
                                                    {row.percent}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="w-full h-2 bg-white/90 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${meta.barColor}`}
                                                style={{ width: `${row.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>
            </div>

            {/* DISCLAIMER NON-DIAGNOSTIK */}
            <div className="bg-slate-100/80 border border-slate-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-slate-600">
                <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    Visualisasi di <strong>Mind Insights</strong> bertujuan membantumu mengamati pola keseharian secara reflektif, bukan sebagai alat evaluasi klinis atau diagnosis medis.
                </p>
            </div>
        </div>
    )
}