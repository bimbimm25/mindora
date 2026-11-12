'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import { User, Save, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'

export default function ClientSettings({
    email,
    initialFullName,
}: {
    email: string
    initialFullName: string
}) {
    const [fullName, setFullName] = useState(initialFullName)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    async function handleSubmit(formData: FormData) {
        setIsSaving(true)
        setMessage(null)
        const res = await updateProfile(formData)
        if (res?.error) {
            setMessage({ type: 'error', text: res.error })
        } else if (res?.success) {
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' })
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* CARD 1: PROFIL PENGGUNA */}
            <form
                action={handleSubmit}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
            >
                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold text-slate-800">Informasi Profil</h2>
                            <p className="text-xs text-slate-500">Kelola identitas akun MINDORA milikmu</p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-5 py-2 text-sm font-medium text-white bg-purple-700 rounded-xl hover:bg-purple-800 transition flex items-center gap-2 shadow-sm disabled:opacity-60 cursor-pointer"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {message && (
                        <div
                            className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${message.type === 'success'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                        >
                            {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                            {message.text}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="full_name">
                                Nama Lengkap
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Alamat Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 cursor-not-allowed"
                            />
                        </div>
                    </div>
                </div>
            </form>

            {/* CARD 2: JAMINAN PRIVASI & KEAMANAN */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2.5 text-emerald-700">
                    <ShieldCheck className="w-5 h-5" />
                    <h3 className="text-base font-bold text-slate-800">Privasi & Perlindungan Data</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Seluruh catatan suasana hati (Mind Tracker) dan tulisan jurnal refleksi (Smart Journal) dilindungi dengan kebijakan keamanan tingkat baris (Row Level Security). Hanya akunmu yang memiliki otorisasi untuk membaca, mengubah, atau menghapus data pribadi tersebut—administrator sistem sekalipun tidak memiliki akses untuk membaca isi jurnal pribadimu.
                </p>
            </div>
        </div>
    )
}