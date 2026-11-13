import { Suspense } from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import DashboardHeader from './DashboardHeader'
import {
    SmilePlus,
    BookHeart,
    Target,
    GraduationCap,
    LineChart,
    Sparkles,
    ArrowRight,
    Clock,
    HeartHandshake,
    ChevronRight,
    Loader2,
} from 'lucide-react'

const MOOD_EMOJI: Record<string, { emoji: string; badge: string }> = {
    Bahagia: {
        emoji: '😊',
        badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    Tenang: {
        emoji: '🌿',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    Lelah: {
        emoji: '🥱',
        badge: 'bg-slate-200/80 text-slate-800 border-slate-300',
    },
    Cemas: {
        emoji: '😰',
        badge: 'bg-purple-100 text-purple-800 border-purple-200',
    },
    Sedih: {
        emoji: '😢',
        badge: 'bg-sky-100 text-sky-800 border-sky-200',
    },
    Marah: {
        emoji: '😠',
        badge: 'bg-rose-100 text-rose-800 border-rose-200',
    },
}

const QUICK_MODULES = [
    {
        title: 'Mind Tracker',
        desc: 'Catat suasana hati & intensitasmu hari ini',
        href: '/mind-tracker',
        icon: SmilePlus,
        iconBg: 'bg-purple-100 text-purple-700',
        hoverBorder: 'hover:border-purple-300',
    },
    {
        title: 'Smart Journal',
        desc: 'Tulis refleksi pribadi di ruang aman RLS',
        href: '/smart-journal',
        icon: BookHeart,
        iconBg: 'bg-emerald-100 text-emerald-700',
        hoverBorder: 'hover:border-emerald-300',
    },
    {
        title: 'Mood Quest',
        desc: 'Langkah kecil merawat diri tanpa tekanan',
        href: '/mood-quest',
        icon: Target,
        iconBg: 'bg-amber-100 text-amber-700',
        hoverBorder: 'hover:border-amber-300',
    },
    {
        title: 'Mind Learn',
        desc: 'Bacaan ringan seputar regulasi emosi',
        href: '/mind-learn',
        icon: GraduationCap,
        iconBg: 'bg-sky-100 text-sky-700',
        hoverBorder: 'hover:border-sky-300',
    },
    {
        title: 'Mind Insights',
        desc: 'Lihat pola & grafik emosimu dari waktu ke waktu',
        href: '/mind-insights',
        icon: LineChart,
        iconBg: 'bg-violet-100 text-violet-700',
        hoverBorder: 'hover:border-violet-300',
    },
]

async function DashboardContent() {
    await connection()
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const [profileRes, moodsRes, journalsRes, questsRes] = await Promise.all([
        supabase
            .from('profiles')
            .select('full_name')
            .eq('id', user.id)
            .single(),
        supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('journal_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('user_missions')
            .select('id')
            .eq('user_id', user.id),
    ])

    const fullName =
        profileRes.data?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split('@')[0] ||
        'Teman MINDORA'
    const firstName = fullName.trim().split(' ')[0]

    const moodEntries = moodsRes.data || []
    const journalEntries = journalsRes.data || []
    const completedQuestsCount = questsRes.data?.length || 0

    const latestMood = moodEntries[0]
    const latestMoodName = latestMood
        ? latestMood.mood_type || latestMood.mood || 'Tenang'
        : null
    const latestMoodMeta = latestMoodName
        ? MOOD_EMOJI[latestMoodName] || MOOD_EMOJI.Tenang
        : null

    return (
        <div className="max-w-5xl mx-auto space-y-5 sm:space-y-7 pb-6">
            {/* 1. MOBILE-APP STYLE GREETING HERO BANNER (CLIENT COMPONENT) */}
            <DashboardHeader
                firstName={firstName}
                latestMoodCreatedAt={latestMood?.created_at || null}
            />

            {/* 2. RINGKASAN STATISTIK KESEJAHTERAAN */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Mood Terakhir
                        </span>
                        <span className="text-lg">
                            {latestMoodMeta ? latestMoodMeta.emoji : '🌿'}
                        </span>
                    </div>
                    <p className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                        {latestMoodName || 'Belum ada'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        {latestMood
                            ? `Intensitas ${latestMood.intensity}/5`
                            : 'Mulai check-in pertamamu'}
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Total Check-in
                        </span>
                        <div className="p-1.5 rounded-xl bg-purple-50 text-purple-700">
                            <SmilePlus className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {moodEntries.length}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Catatan suasana hati
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Jurnal Pribadi
                        </span>
                        <div className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
                            <BookHeart className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {journalEntries.length}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Refleksi tersimpan aman
                    </p>
                </div>

                <div className="bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Mood Quest
                        </span>
                        <div className="p-1.5 rounded-xl bg-amber-50 text-amber-700">
                            <Target className="w-4 h-4" />
                        </div>
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                        {completedQuestsCount}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                        Aktivitas self-care selesai
                    </p>
                </div>
            </section>

            {/* 3. NAVIGASI CEPAT LIMA FITUR UTAMA */}
            <section className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-700" />
                        Ruang Pendampingmu
                    </h2>
                    <span className="text-[11px] text-slate-400">Pilih fitur</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUICK_MODULES.map((mod) => (
                        <Link
                            key={mod.href}
                            href={mod.href}
                            className={`group bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs hover:shadow-sm hover:-translate-y-0.5 transition-all flex items-center justify-between gap-3 active:scale-98 ${mod.hoverBorder}`}
                        >
                            <div className="flex items-center gap-3.5 min-w-0">
                                <div
                                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform ${mod.iconBg}`}
                                >
                                    <mod.icon className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                                        {mod.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                        {mod.desc}
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                    ))}
                </div>
            </section>

            {/* 4. KILAS BALIK AKTIVITAS TERBARU (MOOD & JURNAL) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <section className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                            <SmilePlus className="w-4 h-4 text-purple-700" />
                            Suasana Hati Terakhir
                        </h3>
                        <Link
                            href="/mind-tracker"
                            className="text-[11px] font-bold text-purple-700 hover:underline flex items-center gap-1"
                        >
                            Lihat Semua <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="p-4 space-y-2.5">
                        {moodEntries.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                    Belum ada catatan suasana hati.
                                </p>
                                <Link
                                    href="/mind-tracker"
                                    className="inline-block mt-2 text-xs font-bold text-purple-700 hover:underline"
                                >
                                    + Tambah catatan sekarang
                                </Link>
                            </div>
                        ) : (
                            moodEntries.slice(0, 3).map((item) => {
                                const mName = item.mood_type || item.mood || 'Tenang'
                                const meta = MOOD_EMOJI[mName] || MOOD_EMOJI.Tenang
                                return (
                                    <div
                                        key={item.id}
                                        className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <span className="text-2xl shrink-0">{meta.emoji}</span>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-bold text-slate-800">
                                                        {mName}
                                                    </span>
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${meta.badge}`}
                                                    >
                                                        {item.intensity}/5
                                                    </span>
                                                </div>
                                                {item.notes && (
                                                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                                                        {item.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0">
                                            <Clock className="w-3 h-3" />
                                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </section>

                <section className="bg-white border border-slate-200/90 rounded-3xl shadow-2xs overflow-hidden">
                    <div className="bg-slate-50/80 border-b border-slate-200/80 px-5 py-3.5 flex items-center justify-between">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2">
                            <BookHeart className="w-4 h-4 text-emerald-700" />
                            Jurnal Refleksi Terakhir
                        </h3>
                        <Link
                            href="/smart-journal"
                            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                        >
                            Buka Jurnal <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="p-4 space-y-2.5">
                        {journalEntries.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                    Belum ada tulisan jurnal pribadi.
                                </p>
                                <Link
                                    href="/smart-journal"
                                    className="inline-block mt-2 text-xs font-bold text-emerald-700 hover:underline"
                                >
                                    + Tulis refleksi pertamamu
                                </Link>
                            </div>
                        ) : (
                            journalEntries.slice(0, 3).map((journal) => (
                                <Link
                                    key={journal.id}
                                    href="/smart-journal"
                                    className="block p-3 rounded-2xl bg-slate-50/70 hover:bg-emerald-50/40 border border-slate-100 hover:border-emerald-200 transition"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                                            {journal.title || 'Catatan Refleksi'}
                                        </h4>
                                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                                            {new Date(journal.created_at).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                            })}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                                        {journal.content}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* 5. PESAN PENENANG HARIAN */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-700">
                <HeartHandshake className="w-5 h-5 text-emerald-700 shrink-0" />
                <p className="leading-relaxed">
                    <strong>Pengingat Lembut:</strong> Kamu tidak harus selalu produktif atau merasa baik-baik saja setiap hari. Merawat diri dimulai dari keberanian untuk mengakui apa yang sedang kamu rasakan.
                </p>
            </div>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-purple-700" />
                    <span>Menyiapkan ruang MINDORA milikmu...</span>
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    )
}