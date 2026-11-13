'use client'

import { useState } from 'react'
import { updateProfile } from './actions'
import {
    User,
    Save,
    ShieldCheck,
    Loader2,
    CheckCircle2,
    Mail,
    Lock,
    HeartHandshake,
    Info,
    Sparkles,
    AlertCircle,
} from 'lucide-react'

export default function ClientSettings({
    email,
    initialFullName,
}: {
    email: string
    initialFullName: string
}) {
    const [fullName, setFullName] = useState(initialFullName)
    const [isSaving, setIsSaving] = useState(false)
    const [message, setMessage] = useState<{
        type: 'success' | 'error'
        text: string
    } | null>(null)

    const displayInitial = (fullName.trim() || email || 'M')
        .charAt(0)
        .toUpperCase()

    const hasChanges = fullName.trim() !== initialFullName.trim()

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
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* MOBILE-APP STYLE PROFILE HERO BANNER */}
            <header className="bg-linear-to-br from-slate-800 via-purple-800 to-indigo-900 rounded-3xl p-5 sm:p-7 text-white shadow-md shadow-purple-950/10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Avatar Inisial Dinamis */}
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/15 backdrop-blur-xs border border-white/25 flex items-center justify-center text-2xl sm:text-3xl font-extrabold text-white shrink-0 shadow-inner">
                            {displayInitial}
                        </div>

                        <div className="min-w-0">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-[11px] font-semibold text-emerald-200 mb-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> Akun Terlindungi RLS
                            </span>
                            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight truncate">
                                {fullName.trim() || 'Pengguna MINDORA'}
                            </h1>
                            <p className="text-xs sm:text-sm text-purple-200/90 truncate flex items-center gap-1.5 mt-0.5">
                                <Mail className="w-3.5 h-3.5 shrink-0" />
                                {email}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xs border border-white/15 rounded-2xl px-4 py-2.5 self-start sm:self-center shrink-0">
                        <p className="text-[10px] uppercase tracking-wider text-purple-200 font-semibold">
                            Status Ruang
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Privat & Aktif
                        </p>
                    </div>
                </div>
            </header>

            {/* TOAST NOTIFIKASI */}
            {message && (
                <div
                    className={`animate-fade-up px-4 py-3.5 rounded-2xl text-xs sm:text-sm font-semibold flex items-center justify-between shadow-sm ${message.type === 'success'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-rose-600 text-white'
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {message.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                        ) : (
                            <AlertCircle className="w-4 h-4 shrink-0" />
                        )}
                        {message.text}
                    </span>
                </div>
            )}

            {/* CARD 1: FORM INFORMASI PROFIL */}
            <form
                action={handleSubmit}
                className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden"
            >
                <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 sm:px-6 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-sm sm:text-base font-bold text-slate-800">
                                Informasi Profil
                            </h2>
                            <p className="text-[11px] text-slate-500">
                                Kelola nama panggilan yang tampil di ruang MINDORA milikmu
                            </p>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving || !hasChanges}
                        className="hidden sm:flex px-5 py-2.5 text-xs font-bold text-white bg-purple-700 rounded-xl hover:bg-purple-800 transition items-center gap-2 shadow-sm shadow-purple-700/20 disabled:opacity-50 cursor-pointer active:scale-95"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>

                <div className="p-5 sm:p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label
                                className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2"
                                htmlFor="full_name"
                            >
                                Nama Lengkap / Panggilan
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Masukkan nama panggilanmu..."
                                className="w-full px-4 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            />
                            <p className="text-[11px] text-slate-400 mt-1.5">
                                Nama ini digunakan untuk menyapamu di halaman Dashboard.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-2">
                                Alamat Email Akun
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    disabled
                                    className="w-full pl-4 pr-24 py-3 border border-slate-200 rounded-2xl text-sm bg-slate-50/90 text-slate-500 cursor-not-allowed font-medium"
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                    <Lock className="w-3 h-3" /> Terkunci
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1.5">
                                Email utama terhubung langsung dengan autentikasi akunmu.
                            </p>
                        </div>
                    </div>

                    {/* TOMBOL SIMPAN FULL-WIDTH KHUSUS LAYAR HP */}
                    <button
                        type="submit"
                        disabled={isSaving || !hasChanges}
                        className="w-full sm:hidden py-3.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-2xl shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </div>
            </form>

            {/* CARD 2: JAMINAN PRIVASI & KEAMANAN */}
            <section className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-start gap-3.5">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Privasi & Perlindungan Data Pribadi
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                            Seluruh catatan suasana hati (<strong>Mind Tracker</strong>) dan tulisan jurnal refleksi (<strong>Smart Journal</strong>) dilindungi dengan kebijakan keamanan tingkat baris (<em>Row Level Security</em>). Hanya akunmu yang memiliki otorisasi untuk membaca, mengubah, atau menghapus data pribadi tersebut—administrator sistem sekalipun tidak memiliki akses untuk membaca isi jurnal pribadimu.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <Lock className="w-4 h-4 text-purple-700 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">
                                Isolasi Data Pengguna
                            </p>
                            <p className="text-[11px] text-slate-500">
                                Setiap kueri terikat pada ID sesi akun aktif
                            </p>
                        </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                        <HeartHandshake className="w-4 h-4 text-emerald-700 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-slate-800">
                                Bebas Iklan & Pelacakan
                            </p>
                            <p className="text-[11px] text-slate-500">
                                Tulisanmu tidak pernah dijual atau dibagikan
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARD 3: BATASAN ETIS & BANTUAN PROFESIONAL */}
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs text-slate-600">
                <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                    <strong>Catatan Kesejahteraan:</strong> MINDORA adalah ruang pendamping refleksi mandiri, bukan layanan medis maupun pengganti konsultasi psikolog atau psikiater. Jika kamu membutuhkan dukungan darurat, segera hubungi tenaga profesional atau layanan konseling terdekat.
                </p>
            </div>
        </div>
    )
}