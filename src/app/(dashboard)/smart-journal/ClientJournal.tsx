'use client'

import { useRef, useState } from 'react'
import { saveJournal, deleteJournal } from './actions'
import { Save, RotateCcw, BookHeart, Calendar, Trash2, Loader2, Sparkles, Search } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

const PROMPT_SUGGESTIONS = [
    'Apa hal yang paling kamu rasakan hari ini?',
    'Apa yang membuat harimu terasa sulit atau menantang?',
    'Satu hal kecil apa yang ingin kamu syukuri hari ini?',
    'Apa hal positif yang berhasil kamu lakukan hari ini?',
    'Apa satu hal yang ingin kamu perbaiki untuk esok hari?',
]

export default function ClientJournal({ initialJournals }: { initialJournals: any[] }) {
    const formRef = useRef<HTMLFormElement>(null)
    const [selectedPrompt, setSelectedPrompt] = useState<string>('')
    const [searchQuery, setSearchQuery] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        const res = await saveJournal(formData)
        if (res?.success) {
            formRef.current?.reset()
            setSelectedPrompt('')
        }
        setIsSubmitting(false)
    }

    async function handleDelete(id: string) {
        if (!confirm('Yakin ingin menghapus catatan jurnal ini?')) return
        setDeletingId(id)
        await deleteJournal(id)
        setDeletingId(null)
    }

    const filteredJournals = initialJournals.filter((journal) => {
        const query = searchQuery.toLowerCase()
        return (
            journal.title.toLowerCase().includes(query) ||
            journal.content.toLowerCase().includes(query) ||
            (journal.prompt_used && journal.prompt_used.toLowerCase().includes(query))
        )
    })

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* CARD 1: FORM INPUT JURNAL */}
            <form ref={formRef} action={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Top Action Toolbar */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                            <BookHeart className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Ruang Jurnal Pribadi</h2>
                            <p className="text-xs text-slate-500">Refleksikan pikiran dan perasaanmu dengan aman</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="reset"
                            onClick={() => setSelectedPrompt('')}
                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition flex items-center gap-2 cursor-pointer"
                        >
                            <RotateCcw className="w-4 h-4" /> Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal'}
                        </button>
                    </div>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6">
                    {/* Quick Guided Prompts */}
                    <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            Pilih Pertanyaan Refleksi (Opsional):
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {PROMPT_SUGGESTIONS.map((prompt) => (
                                <button
                                    type="button"
                                    key={prompt}
                                    onClick={() => setSelectedPrompt(prompt === selectedPrompt ? '' : prompt)}
                                    className={`text-xs px-3.5 py-1.5 rounded-full border transition cursor-pointer ${selectedPrompt === prompt
                                            ? 'bg-purple-100 border-purple-300 text-purple-700 font-medium'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                        <input type="hidden" name="prompt_used" value={selectedPrompt} />
                    </div>

                    {/* Judul Jurnal */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="title">
                            Judul Refleksi
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                            placeholder="Misal: Perasaan Lega Hari Ini, Mengatasi Rasa Cemas, dll."
                        />
                    </div>

                    {/* Isi Jurnal */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="content">
                            Isi Jurnal <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            required
                            rows={8}
                            className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition resize-none leading-relaxed"
                            placeholder={
                                selectedPrompt
                                    ? `Mulai refleksikan: "${selectedPrompt}"...`
                                    : 'Tuliskan bebas apa pun yang ada di benakmu...'
                            }
                        />
                    </div>
                </div>
            </form>

            {/* CARD 2: TABEL & DAFTAR RIWAYAT JURNAL */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                {/* Header & Search */}
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                        <h3 className="text-base font-semibold text-slate-800">Riwayat Jurnal Refleksi</h3>
                    </div>

                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari jurnal..."
                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                {/* Datatable */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50/40 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3.5">Tanggal</th>
                                <th className="px-6 py-3.5">Judul</th>
                                <th className="px-6 py-3.5">Isi Refleksi</th>
                                <th className="px-6 py-3.5">Prompt Terkait</th>
                                <th className="px-6 py-3.5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredJournals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-400 text-sm">
                                        {searchQuery ? 'Tidak ada jurnal yang cocok dengan pencarian.' : 'Belum ada catatan jurnal. Mulai tulis refleksi pertamamu!'}
                                    </td>
                                </tr>
                            ) : (
                                filteredJournals.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-500">
                                            {format(new Date(item.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                                            {item.title}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs text-slate-600 truncate text-xs">
                                            {item.content}
                                        </td>
                                        <td className="px-6 py-4 max-w-xs text-xs text-purple-700 italic truncate">
                                            {item.prompt_used || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                className="text-slate-400 hover:text-rose-600 transition p-1.5 rounded-lg hover:bg-rose-50 disabled:opacity-50 cursor-pointer"
                                                title="Hapus Jurnal"
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