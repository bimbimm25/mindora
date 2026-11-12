'use client'

import { useRef, useState } from 'react'
import {
    createLearningContent,
    togglePublishContent,
    deleteLearningContent,
    createMission,
    deleteMission,
} from './actions'
import AdminNav, { AdminSection } from '@/components/admin/adminNav'
import {
    GraduationCap,
    Target,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    RotateCcw,
    Search,
    Users,
    CheckCircle2,
    FileText,
    ArrowRight,
} from 'lucide-react'

const MISSION_CATEGORIES = [
    'Healthy Habits',
    'Self Appreciation',
    'Social Connection',
    'Emotional Awareness',
    'Self Reflection',
    'Positive Activities',
]

export default function ClientAdmin({
    contents,
    missions,
    totalUsers,
}: {
    contents: any[]
    missions: any[]
    totalUsers: number
}) {
    const [activeSection, setActiveSection] = useState<AdminSection>('overview')
    const learnFormRef = useRef<HTMLFormElement>(null)
    const missionFormRef = useRef<HTMLFormElement>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [busyId, setBusyId] = useState<string | null>(null)
    const [learnSearch, setLearnSearch] = useState('')
    const [learnFilter, setLearnFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [questSearch, setQuestSearch] = useState('')

    const publishedCount = contents.filter((c) => c.is_published).length
    const draftCount = contents.length - publishedCount

    const filteredContents = contents.filter((item) => {
        const matchSearch =
            item.title.toLowerCase().includes(learnSearch.toLowerCase()) ||
            item.category.toLowerCase().includes(learnSearch.toLowerCase())
        const matchStatus =
            learnFilter === 'all' ||
            (learnFilter === 'published' && item.is_published) ||
            (learnFilter === 'draft' && !item.is_published)
        return matchSearch && matchStatus
    })

    const filteredMissions = missions.filter(
        (m) =>
            m.title.toLowerCase().includes(questSearch.toLowerCase()) ||
            m.category.toLowerCase().includes(questSearch.toLowerCase())
    )

    async function handleCreateLearn(formData: FormData) {
        setIsSubmitting(true)
        const res = await createLearningContent(formData)
        if (res?.success) {
            learnFormRef.current?.reset()
        } else if (res?.error) {
            alert(res.error)
        }
        setIsSubmitting(false)
    }

    async function handleTogglePublish(id: string, status: boolean) {
        setBusyId(id)
        await togglePublishContent(id, status)
        setBusyId(null)
    }

    async function handleDeleteLearn(id: string) {
        if (!confirm('Hapus materi edukasi ini secara permanen?')) return
        setBusyId(id)
        await deleteLearningContent(id)
        setBusyId(null)
    }

    async function handleCreateMission(formData: FormData) {
        setIsSubmitting(true)
        const res = await createMission(formData)
        if (res?.success) {
            missionFormRef.current?.reset()
        } else if (res?.error) {
            alert(res.error)
        }
        setIsSubmitting(false)
    }

    async function handleDeleteMission(id: string) {
        if (!confirm('Hapus aktivitas Mood Quest ini?')) return
        setBusyId(id)
        await deleteMission(id)
        setBusyId(null)
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] md:flex">
            <AdminNav
                activeSection={activeSection}
                onSelectSection={setActiveSection}
                counts={{ contents: contents.length, missions: missions.length }}
            />

            <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* SECTION 1: RINGKASAN ADMIN */}
                    {activeSection === 'overview' && (
                        <>
                            <header>
                                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                                    Dashboard Administrator
                                </h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Kelola konten edukasi Mind Learn dan aktivitas kesejahteraan Mood Quest.
                                </p>
                            </header>

                            {/* Kartu Statistik */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between text-slate-500 mb-2">
                                        <span className="text-xs font-semibold uppercase">Materi Published</span>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">{publishedCount}</p>
                                    <p className="text-xs text-slate-500 mt-1">Tayang di Mind Learn</p>
                                </div>

                                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between text-slate-500 mb-2">
                                        <span className="text-xs font-semibold uppercase">Materi Draft</span>
                                        <FileText className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">{draftCount}</p>
                                    <p className="text-xs text-slate-500 mt-1">Belum dipublikasikan</p>
                                </div>

                                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between text-slate-500 mb-2">
                                        <span className="text-xs font-semibold uppercase">Aktivitas Quest</span>
                                        <Target className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">{missions.length}</p>
                                    <p className="text-xs text-slate-500 mt-1">Tersedia untuk pengguna</p>
                                </div>

                                <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
                                    <div className="flex items-center justify-between text-slate-500 mb-2">
                                        <span className="text-xs font-semibold uppercase">Total Pengguna</span>
                                        <Users className="w-4 h-4 text-sky-600" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-800">{totalUsers}</p>
                                    <p className="text-xs text-slate-500 mt-1">Akun terdaftar</p>
                                </div>
                            </div>

                            {/* Akses Cepat Manajemen */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button
                                    onClick={() => setActiveSection('learn')}
                                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-300 hover:shadow-md transition text-left flex items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg mb-2">
                                            <GraduationCap className="w-3.5 h-3.5" /> Mind Learn
                                        </span>
                                        <h3 className="text-base font-bold text-slate-800">
                                            Kelola Materi Edukasi
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Tambah artikel baru, atur kategori, atau ubah status publish/draft.
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-1 transition" />
                                </button>

                                <button
                                    onClick={() => setActiveSection('quest')}
                                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition text-left flex items-center justify-between group cursor-pointer"
                                >
                                    <div>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg mb-2">
                                            <Target className="w-3.5 h-3.5" /> Mood Quest
                                        </span>
                                        <h3 className="text-base font-bold text-slate-800">
                                            Kelola Aktivitas Positif
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Susun langkah-langkah perawatan diri yang santai dan suportif.
                                        </p>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                                </button>
                            </div>

                            {/* Kebijakan Privasi Admin */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-start gap-3.5">
                                <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Batas Otorisasi & Privasi Pengguna
                                    </h3>
                                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                        Sesuai standar privasi MINDORA, panel administrator hanya memiliki akses ke materi edukasi dan daftar misi publik. Catatan suasana hati (Mind Tracker) dan tulisan refleksi pribadi (Smart Journal) pengguna dilindungi kebijakan RLS dan tidak dapat dibuka oleh admin.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}

                    {/* SECTION 2: KELOLA MATERI MIND LEARN */}
                    {activeSection === 'learn' && (
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Materi Mind Learn</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Buat, publikasikan, dan perbarui konten edukasi kesehatan mental.
                                </p>
                            </div>

                            <form
                                ref={learnFormRef}
                                action={handleCreateLearn}
                                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* Action Toolbar */}
                                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-100 text-purple-700 rounded-lg">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-slate-800">Form Materi Baru</h2>
                                            <p className="text-xs text-slate-500">Pastikan bahasa informatif dan tidak menghakimi</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="reset"
                                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <RotateCcw className="w-4 h-4" /> Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-5 py-2 text-sm font-medium text-white bg-purple-700 rounded-xl hover:bg-purple-800 transition flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                            Simpan Materi
                                        </button>
                                    </div>
                                </div>

                                {/* Body Form */}
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Judul Materi <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                name="title"
                                                type="text"
                                                required
                                                placeholder="Contoh: Mengenal dan Mengelola Academic Burnout"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Kategori <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                name="category"
                                                type="text"
                                                required
                                                placeholder="Contoh: Manajemen Stres, Self-Esteem"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Isi Artikel Edukasi <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            name="content"
                                            rows={5}
                                            required
                                            placeholder="Tuliskan isi materi secara terstruktur dan mudah dipahami..."
                                            className="w-full p-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-600 resize-none leading-relaxed"
                                        />
                                    </div>

                                    <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="is_published"
                                            defaultChecked
                                            className="rounded border-slate-300 text-purple-700 focus:ring-purple-600"
                                        />
                                        Langsung publikasikan ke pengguna (Published)
                                    </label>
                                </div>
                            </form>

                            {/* Tabel Materi */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                    <div className="flex flex-wrap gap-1.5">
                                        {(
                                            [
                                                { key: 'all', label: `Semua (${contents.length})` },
                                                { key: 'published', label: `Published (${publishedCount})` },
                                                { key: 'draft', label: `Draft (${draftCount})` },
                                            ] as const
                                        ).map((tab) => (
                                            <button
                                                key={tab.key}
                                                onClick={() => setLearnFilter(tab.key)}
                                                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${learnFilter === tab.key
                                                        ? 'bg-purple-700 text-white'
                                                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="relative w-full lg:w-64">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={learnSearch}
                                            onChange={(e) => setLearnSearch(e.target.value)}
                                            placeholder="Cari judul atau kategori..."
                                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-600"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-600">
                                        <thead className="bg-slate-50/40 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3.5">Judul Materi</th>
                                                <th className="px-6 py-3.5">Kategori</th>
                                                <th className="px-6 py-3.5">Status</th>
                                                <th className="px-6 py-3.5 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredContents.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-10 text-center text-xs text-slate-400">
                                                        Tidak ada materi yang sesuai dengan filter.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredContents.map((item) => (
                                                    <tr key={item.id} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-6 py-4 font-semibold text-slate-800 text-xs">
                                                            {item.title}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs whitespace-nowrap">{item.category}</td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${item.is_published
                                                                        ? 'bg-emerald-50 text-emerald-700'
                                                                        : 'bg-amber-50 text-amber-700'
                                                                    }`}
                                                            >
                                                                {item.is_published ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleTogglePublish(item.id, item.is_published)}
                                                                disabled={busyId === item.id}
                                                                className="p-1.5 text-slate-500 hover:text-purple-700 rounded-lg hover:bg-purple-50 transition cursor-pointer"
                                                                title={item.is_published ? 'Ubah ke Draft' : 'Publikasikan'}
                                                            >
                                                                {item.is_published ? (
                                                                    <EyeOff className="w-4 h-4" />
                                                                ) : (
                                                                    <Eye className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteLearn(item.id)}
                                                                disabled={busyId === item.id}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                                                title="Hapus Materi"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                    )}

                    {/* SECTION 3: KELOLA AKTIVITAS MOOD QUEST */}
                    {activeSection === 'quest' && (
                        <div className="space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">Aktivitas Mood Quest</h1>
                                <p className="text-sm text-slate-500 mt-1">
                                    Tambahkan rekomendasi aktivitas ringan tanpa tekanan untuk membantu kesejahteraan pengguna.
                                </p>
                            </div>

                            <form
                                ref={missionFormRef}
                                action={handleCreateMission}
                                className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden"
                            >
                                {/* Action Toolbar */}
                                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg">
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h2 className="text-base font-semibold text-slate-800">Form Aktivitas Baru</h2>
                                            <p className="text-xs text-slate-500">Hindari istilah kompetitif, skor, atau target wajib</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            type="reset"
                                            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                        >
                                            <RotateCcw className="w-4 h-4" /> Reset
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                                        >
                                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                            Simpan Aktivitas
                                        </button>
                                    </div>
                                </div>

                                {/* Body Form */}
                                <div className="p-6 space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Nama Aktivitas <span className="text-rose-500">*</span>
                                            </label>
                                            <input
                                                name="title"
                                                type="text"
                                                required
                                                placeholder="Contoh: Berjalan Santai 10 Menit di Luar Ruangan"
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                                Kategori <span className="text-rose-500">*</span>
                                            </label>
                                            <select
                                                name="category"
                                                required
                                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white outline-none focus:ring-2 focus:ring-emerald-500"
                                            >
                                                {MISSION_CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Instruksi Aktivitas <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            required
                                            placeholder="Jelaskan langkah sederhana dan menenangkan yang dapat dilakukan pengguna..."
                                            className="w-full p-4 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </form>

                            {/* Tabel Aktivitas */}
                            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                                <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <h3 className="text-sm font-bold text-slate-800">
                                        Daftar Aktivitas Terdaftar ({filteredMissions.length})
                                    </h3>

                                    <div className="relative w-full sm:w-64">
                                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={questSearch}
                                            onChange={(e) => setQuestSearch(e.target.value)}
                                            placeholder="Cari aktivitas..."
                                            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-600">
                                        <thead className="bg-slate-50/40 text-xs font-semibold uppercase text-slate-500 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-3.5">Nama Aktivitas</th>
                                                <th className="px-6 py-3.5">Kategori</th>
                                                <th className="px-6 py-3.5">Instruksi</th>
                                                <th className="px-6 py-3.5 text-right">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {filteredMissions.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-10 text-center text-xs text-slate-400">
                                                        Tidak ada aktivitas ditemukan.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredMissions.map((m) => (
                                                    <tr key={m.id} className="hover:bg-slate-50/60 transition">
                                                        <td className="px-6 py-4 font-semibold text-slate-800 text-xs whitespace-nowrap">
                                                            {m.title}
                                                        </td>
                                                        <td className="px-6 py-4 text-xs whitespace-nowrap">
                                                            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                                                {m.category}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-xs max-w-md truncate">{m.description}</td>
                                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                                            <button
                                                                onClick={() => handleDeleteMission(m.id)}
                                                                disabled={busyId === m.id}
                                                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                                                                title="Hapus Aktivitas"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
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
                    )}
                </div>
            </main>
        </div>
    )
}