import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { SmilePlus, PenLine, Sparkles, Loader2 } from 'lucide-react'
import { connection } from 'next/server' // 1. Import connection

// 2. Komponen Async
async function DashboardContent() {
    await connection() // 3. Panggil connection di sini agar Next.js tahu ini dinamis

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

    const firstName = profile?.full_name?.split(' ')[0] || 'Teman'

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                    Halo, {firstName}! 👋
                </h1>
                <p className="text-slate-500 mt-1">Bagaimana perasaanmu hari ini?</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/mind-tracker" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-purple-700 transition-colors">Catat Mood Hari Ini</h3>
                        <p className="text-sm text-slate-500 mt-1">Pahami apa yang sedang kamu rasakan.</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-xl text-purple-600 group-hover:scale-110 transition-transform">
                        <SmilePlus className="w-6 h-6" />
                    </div>
                </Link>

                <Link href="/smart-journal" className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">Tulis Jurnal Refleksi</h3>
                        <p className="text-sm text-slate-500 mt-1">Tuangkan isi pikiranmu dengan aman.</p>
                    </div>
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600 group-hover:scale-110 transition-transform">
                        <PenLine className="w-6 h-6" />
                    </div>
                </Link>
            </div>

            <section className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 rounded-full mb-4 text-slate-400">
                    <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Belum Ada Catatan</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto text-sm">
                    MINDORA akan merangkum kesejahteraan emosionalmu di sini setelah kamu mulai mencatat mood dan aktivitas harianmu.
                </p>
            </section>
        </div>
    )
}

// 4. Komponen Utama dengan Suspense Boundary
export default function DashboardPage() {
    return (
        <Suspense
            fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-4" />
                    <p>Memuat dashboard...</p>
                </div>
            }
        >
            <DashboardContent />
        </Suspense>
    )
}