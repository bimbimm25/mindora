'use client'

import { useRef, useState } from 'react'
import { saveMood, deleteMood } from './actions'
import { Save, RotateCcw, SmilePlus, Calendar, Activity, Trash2, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const MOOD_OPTIONS = [
    { label: 'Bahagia', emoji: '😊', color: 'peer-checked:bg-amber-50 peer-checked:border-amber-400 peer-checked:text-amber-700' },
    { label: 'Tenang', emoji: '🌿', color: 'peer-checked:bg-emerald-50 peer-checked:border-emerald-400 peer-checked:text-emerald-700' },
    { label: 'Lelah', emoji: '🥱', color: 'peer-checked:bg-slate-100 peer-checked:border-slate-400 peer-checked:text-slate-700' },
    { label: 'Cemas', emoji: '😰', color: 'peer-checked:bg-violet-50 peer-checked:border-violet-400 peer-checked:text-violet-700' },
    { label: 'Sedih', emoji: '😢', color: 'peer-checked:bg-sky-50 peer-checked:border-sky-400 peer-checked:text-sky-700' },
    { label: 'Marah', emoji: '😡', color: 'peer-checked:bg-rose-50 peer-checked:border-rose-400 peer-checked:text-rose-700' },
]

export default function ClientTracker({ historyData }: { historyData: any[] }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const res = await saveMood(formData)
        if (res?.success) {
            formRef.current?.reset()
        }
        setIsSubmitting(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus catatan mood ini?')) return
        setDeletingId(id)
        await deleteMood(id)
        setDeletingId(null)
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* CARD 1: FORM INPUT MOOD */}
            <form ref={formRef} action={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Top Action Toolbar */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                            <SmilePlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Check-in Suasana Hati</h2>
                            <p className="text-xs text-slate-500">Kenali dan catat perasaanmu saat ini</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="reset"
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-2 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-purple-700 rounded-xl hover:bg-purple-800 transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        {/* Pilihan Emosi */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Suasana Hati <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {MOOD_OPTIONS.map((item) => (
                                    <label key={item.label} className="cursor-pointer">
                                        <input type="radio" name="mood_type" value={item.label} required className="peer sr-only" />
                                        <div className={`p-3 border border-slate-200 rounded-xl text-center transition flex flex-col items-center gap-1 hover:border-slate-300 ${item.color}`}>
                                            <span className="text-xl">{item.emoji}</span>
                                            <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Intensitas Emosi */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Tingkat Intensitas (1 Ringan - 5 Sangat Kuat) <span className="text-rose-500">*</span>
                            </label>
                            <div className="grid grid-cols-5 gap-2">
                                {[1, 2, 3, 4, 5].map((lvl) => (
                                    <label key={lvl} className="cursor-pointer">
                                        <input type="radio" name="intensity" value={lvl} required className="peer sr-only" />
                                        <div className="py-2.5 text-center border border-slate-200 rounded-xl text-sm font-bold text-slate-600 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 peer-checked:text-emerald-700 hover:bg-slate-50 transition">
                                            {lvl}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Catatan Tambahan */}
                    <div className="flex flex-col">
                        <label className="block text-sm font-semibold text-slate-700 mb-2" htmlFor="notes">
                            Catatan Singkat (Opsional)
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={6}
                            className="w-full flex-1 p-3.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                            placeholder="Ceritakan sedikit apa yang sedang terjadi atau hal yang memengaruhimu hari ini..."
                        />
                    </div>
                </div>
            </form>

            {/* CARD 2: TABEL RIWAYAT MOOD */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base font-semibold text-slate-800">Riwayat Mood Harian</h3>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Total: {historyData.length} catatan</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/40 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3.5">Waktu</th>
                                <th className="px-6 py-3.5">Suasana Hati</th>
                                <th className="px-6 py-3.5">Intensitas</th>
                                <th className="px-6 py-3.5">Catatan</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {historyData.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                                        Belum ada riwayat mood yang dicatat. Mulai isi check-in pertamamu di atas!
                                    </td>
                                </tr>
                            ) : (
                                historyData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                            {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                                {item.mood_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                                <Activity className="w-3.5 h-3.5" />
                                                Level {item.intensity}/5
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 max-w-sm text-slate-700 truncate text-xs">
                                            {item.notes || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50"
                                                title="Hapus"
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