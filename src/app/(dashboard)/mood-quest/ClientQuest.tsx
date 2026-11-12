'use client'

import { useState } from 'react'
import { completeMission, deleteUserMission } from './actions'
import { Target, CheckCircle2, History, Trash2, Loader2, Sparkles } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const CATEGORIES = [
    'Semua',
    'Healthy Habits',
    'Self Appreciation',
    'Social Connection',
    'Emotional Awareness',
]

export default function ClientQuest({
    missions,
    completedHistory,
}: {
    missions: any[]
    completedHistory: any[]
}) {
    const [selectedCategory, setSelectedCategory] = useState('Semua')
    const [loadingId, setLoadingId] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const filteredMissions =
        selectedCategory === 'Semua'
            ? missions
            : missions.filter((m) => m.category === selectedCategory)

    async function handleComplete(missionId: string) {
        setLoadingId(missionId)
        await completeMission(missionId)
        setLoadingId(null)
    }

    async function handleDelete(id: string) {
        if (!confirm('Hapus catatan riwayat aktivitas ini?')) return
        setDeletingId(id)
        await deleteUserMission(id)
        setDeletingId(null)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* CARD 1: DAFTAR AKTIVITAS MOOD QUEST */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Toolbar Header & Filter Kategori */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Pilih Aktivitas Kesejahteraan</h2>
                            <p className="text-xs text-slate-500">Lakukan sesuai ritmemu, tanpa target atau paksaan</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {CATEGORIES.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${selectedCategory === category
                                        ? 'bg-purple-700 text-white shadow-sm'
                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Grid Daftar Aktivitas */}
                <div className="p-6">
                    {filteredMissions.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 text-sm">
                            Belum ada aktivitas pada kategori ini. Pastikan kamu sudah menjalankan SQL seed data.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredMissions.map((mission) => (
                                <div
                                    key={mission.id}
                                    className="border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between hover:border-purple-200 hover:shadow-sm transition bg-white"
                                >
                                    <div>
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 mb-3">
                                            <Sparkles className="w-3 h-3" />
                                            {mission.category}
                                        </span>
                                        <h3 className="font-bold text-slate-800 text-base mb-2">{mission.title}</h3>
                                        <p className="text-xs text-slate-600 leading-relaxed mb-6">
                                            {mission.description}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleComplete(mission.id)}
                                        disabled={loadingId === mission.id}
                                        className="w-full py-2.5 px-4 bg-purple-50 hover:bg-purple-700 text-purple-700 hover:text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                                    >
                                        {loadingId === mission.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="w-4 h-4" />
                                        )}
                                        {loadingId === mission.id ? 'Mencatat...' : 'Tandai Sudah Dilakukan'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* CARD 2: TABEL RIWAYAT AKTIVITAS SELESAI */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base font-semibold text-slate-800">Riwayat Aktivitas Positifmu</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                        Total dilakukan: {completedHistory.length} kali
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/40 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3.5">Waktu Selesai</th>
                                <th className="px-6 py-3.5">Aktivitas</th>
                                <th className="px-6 py-3.5">Kategori</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {completedHistory.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-slate-400 text-sm">
                                        Belum ada aktivitas yang diselesaikan. Pilih satu aktivitas ringan di atas saat kamu siap!
                                    </td>
                                </tr>
                            ) : (
                                completedHistory.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                            {format(new Date(item.completed_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                                            {item.missions?.title || 'Aktivitas'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                                                {item.missions?.category || '-'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                                                title="Hapus Riwayat"
                                            >
                                                {deletingId === item.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}