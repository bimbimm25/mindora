import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    SmilePlus,
    PenLine,
    Sparkles,
    Loader2,
    Target,
    GraduationCap,
    BookHeart,
    ArrowRight,
    Clock,
} from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

async function DashboardContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ambil profil + ringkasan data dari 4 tabel secara paralel
    const [profileRes, recentMoodsRes, journalCountRes, questCountRes, learnCountRes] =
        await Promise.all([
            supabase.from('profiles').select('full_name').eq('id', user.id).single(),
            supabase
                .from('mood_entries')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(3),
            supabase
                .from('journal_entries')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id),
            supabase
                .from('user_missions')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id),
            supabase
                .from('learning_progress')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', user.id),
        ])

    const firstName = profileRes.data?.full_name?.split(' ')[0] || 'Teman'
    const recentMoods = recentMoodsRes.data || []
    const latestMood = recentMoods[0] || null
    const journalCount = journalCountRes.count || 0
    const questCount = questCountRes.count || 0
    const learnCount = learnCountRes.count || 0

    const hasAnyData =
        recentMoods.length > 0 || journalCount > 0 || questCount > 0 || learnCount > 0

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Greeting */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                        Halo, {firstName}! 👋
                    </h1>
                    <p className="text-slate-500 mt-1 text-sm">
                        Bagaimana perasaanmu hari ini? Luangkan sejenak waktu untuk dirimu sendiri.
                    </p>
                </div>

                {latestMood && (
                    <div className="bg-purple-50 border border-purple-100 px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start">
                        <span className="text-xs font-medium text-slate-500">Mood Terakhir:</span>
                        <span className="text-xs font-bold text-purple-700 bg-white px-2.5 py-1 rounded-full shadow-2xs">
                            {latestMood.mood_type} (Level {latestMood.intensity}/5)
                        </span>
                    </div>
                )}
            </header>

            {/* Quick Actions (Akses Cepat) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                    href="/mind-tracker"
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group flex items-center justify-between"
                >
                    <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">
                            Catat Mood Hari Ini
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Kenali emosi yang sedang hadir tanpa menghakimi.
                        </p>
                    </div>
                    <div className="bg-purple-50 p-3.5 rounded-xl text-purple-600 group-hover:scale-105 transition-transform">
                        <SmilePlus className="w-6 h-6" />
                    </div>
                </Link>

                <Link
                    href="/smart-journal"
                    className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all group flex items-center justify-between"
                >
                    <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">
                            Tulis Jurnal Refleksi
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                            Tuangkan isi pikiranmu dalam ruang pribadi yang aman.
                        </p>
                    </div>
                    <div className="bg-emerald-50 p-3.5 rounded-xl text-emerald-600 group-hover:scale-105 transition-transform">
                        <PenLine className="w-6 h-6" />
                    </div>
                </Link>
            </div>

            {/* Ringkasan Aktivitas Real-Time atau Empty State */}
            {!hasAnyData ? (
                <section className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center shadow-sm">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-50 rounded-2xl mb-4 text-purple-600">
                        <Sparkles className="w-8 h-8" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Mulai Perjalanan Pertamamu</h2>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm leading-relaxed">
                        MINDORA akan menampilkan ringkasan kesejahteraan emosionalmu di sini setelah kamu mencatat mood atau menulis jurnal pertamamu.
                    </p>
                </section>
            ) : (
                <div className="space-y-6">
                    {/* Kartu Statistik Ringkas */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/smart-journal"
                            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-emerald-200 transition flex items-center gap-4"
                        >
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                <BookHeart className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Jurnal Tersimpan</p>
                                <p className="text-xl font-bold text-slate-800">{journalCount} Catatan</p>
                            </div>
                        </Link>

                        <Link
                            href="/mood-quest"
                            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-purple-200 transition flex items-center gap-4"
                        >
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                <Target className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Mood Quest Selesai</p>
                                <p className="text-xl font-bold text-slate-800">{questCount} Aktivitas</p>
                            </div>
                        </Link>

                        <Link
                            href="/mind-learn"
                            className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-200 transition flex items-center gap-4"
                        >
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Materi Dipelajari</p>
                                <p className="text-xl font-bold text-slate-800">{learnCount} Materi</p>
                            </div>
                        </Link>
                    </div>

                    {/* Riwayat Mood Terbaru */}
                    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50/70 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-600" />
                                <h2 className="text-sm font-bold text-slate-800">Catatan Mood Terakhir</h2>
                            </div>
                            <Link
                                href="/mind-insights"
                                className="text-xs font-semibold text-purple-700 hover:underline flex items-center gap-1"
                            >
                                Lihat Pola Lengkap <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {recentMoods.length === 0 ? (
                            <div className="p-6 text-center text-xs text-slate-400">
                                Belum ada catatan mood terbaru.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentMoods.map((mood) => (
                                    <div
                                        key={mood.id}
                                        className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                                                {mood.mood_type}
                                            </span>
                                            <span className="text-xs text-slate-600 line-clamp-1">
                                                {mood.notes || 'Tidak ada catatan tambahan'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-400 shrink-0">
                                            <span>Intensitas {mood.intensity}/5</span>
                                            <span>•</span>
                                            <span>
                                                {format(new Date(mood.created_at), 'dd MMM, HH:mm', { locale: id })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                    <p className="text-sm">Memuat dashboard...</p>
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    )
}