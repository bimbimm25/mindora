'use client'

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    BarChart,
    Bar,
    Cell,
} from 'recharts'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { LineChart, PieChart, Sparkles, BookHeart, Target, Smile } from 'lucide-react'
import Link from 'next/link'

const MOOD_COLORS: Record<string, string> = {
    Bahagia: '#f59e0b',
    Tenang: '#10b981',
    Lelah: '#64748b',
    Cemas: '#8b5cf6',
    Sedih: '#0ea5e9',
    Marah: '#f43f5e',
}

export default function ClientInsights({
    moodEntries,
    journalCount,
    questCount,
}: {
    moodEntries: any[]
    journalCount: number
    questCount: number
}) {
    // Empty State jika belum ada data mood sama sekali
    if (moodEntries.length === 0) {
        return (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center max-w-3xl mx-auto shadow-sm">
                <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <LineChart className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">Belum Ada Data untuk Dianalisis</h2>
                <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                    Mind Insights merangkum pola emosimu berdasarkan catatan nyata yang kamu buat. Mulai catat suasana hatimu hari ini agar grafik dan ringkasan muncul di sini.
                </p>
                <Link
                    href="/mind-tracker"
                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold rounded-xl transition shadow-sm"
                >
                    Mulai Catat Mood
                </Link>
            </div>
        )
    }

    // 1. Data Tren Intensitas (14 catatan terakhir, diurutkan kronologis)
    const trendData = [...moodEntries]
        .slice(0, 14)
        .reverse()
        .map((entry) => ({
            tanggal: format(new Date(entry.created_at), 'dd MMM', { locale: id }),
            intensitas: entry.intensity,
            mood: entry.mood_type,
        }))

    // 2. Data Distribusi Emosi
    const moodCounts: Record<string, number> = {}
    moodEntries.forEach((entry) => {
        moodCounts[entry.mood_type] = (moodCounts[entry.mood_type] || 0) + 1
    })

    const distributionData = Object.entries(moodCounts)
        .map(([name, total]) => ({
            name,
            total,
            fill: MOOD_COLORS[name] || '#7c3aed',
        }))
        .sort((a, b) => b.total - a.total)

    const mostFrequentMood = distributionData[0]?.name || '-'
    const avgIntensity = (
        moodEntries.reduce((acc, cur) => acc + Number(cur.intensity), 0) / moodEntries.length
    ).toFixed(1)

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* RINGKASAN METRIK UTAMA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase">Total Check-in</span>
                        <Smile className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{moodEntries.length}x</p>
                    <p className="text-xs text-slate-500 mt-1">Emosi tersering: {mostFrequentMood}</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase">Rata-rata Intensitas</span>
                        <LineChart className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{avgIntensity} / 5</p>
                    <p className="text-xs text-slate-500 mt-1">Skala kekuatan emosi</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase">Jurnal Refleksi</span>
                        <BookHeart className="w-4 h-4 text-sky-600" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{journalCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Catatan pribadi tersimpan</p>
                </div>

                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between text-slate-500 mb-2">
                        <span className="text-xs font-semibold uppercase">Aktivitas Positif</span>
                        <Target className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{questCount}</p>
                    <p className="text-xs text-slate-500 mt-1">Mood Quest diselesaikan</p>
                </div>
            </div>

            {/* OBSERVASI SINGKAT BERBASIS DATA NYATA */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 flex items-start gap-3.5">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl shrink-0">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Observasi Pola Catatanmu</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        Dari {moodEntries.length} catatan suasana hati yang kamu simpan, emosi yang paling sering kamu kenali adalah{' '}
                        <span className="font-semibold text-purple-700">{mostFrequentMood}</span> ({distributionData[0]?.total} kali).
                        {questCount > 0
                            ? ` Kamu juga telah meluangkan waktu untuk menyelesaikan ${questCount} aktivitas kesejahteraan di Mood Quest.`
                            : ' Kamu bisa mencoba aktivitas ringan di Mood Quest kapan pun kamu membutuhkan jeda sejenak.'}
                    </p>
                </div>
            </div>

            {/* DUA GRAFIK UTAMA */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Grafik 1: Tren Intensitas Emosi */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <LineChart className="w-5 h-5 text-purple-600" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Grafik Intensitas Emosi Terbaru</h3>
                            <p className="text-xs text-slate-500">Menampilkan hingga 14 catatan terakhir</p>
                        </div>
                    </div>

                    <div className="p-6 h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIntensitas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '12px',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="intensitas"
                                    name="Intensitas"
                                    stroke="#7c3aed"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorIntensitas)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Grafik 2: Distribusi Jenis Emosi */}
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                    <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <PieChart className="w-5 h-5 text-emerald-600" />
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">Distribusi Suasana Hati</h3>
                            <p className="text-xs text-slate-500">Frekuensi masing-masing emosi yang dicatat</p>
                        </div>
                    </div>

                    <div className="p-6 h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '12px',
                                        border: '1px solid #e2e8f0',
                                        fontSize: '12px',
                                    }}
                                />
                                <Bar dataKey="total" name="Jumlah Catatan" radius={[8, 8, 0, 0]}>
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}