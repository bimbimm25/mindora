import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientInsights from './ClientInsights'
import { Loader2 } from 'lucide-react'

async function InsightsContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ambil seluruh data nyata milik pengguna secara paralel
    const [moodRes, journalRes, questRes] = await Promise.all([
        supabase
            .from('mood_entries')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false }),
        supabase
            .from('journal_entries')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
        supabase
            .from('user_missions')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id),
    ])

    return (
        <ClientInsights
            moodEntries={moodRes.data || []}
            journalCount={journalRes.count || 0}
            questCount={questRes.count || 0}
        />
    )
}

export default function MindInsightsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mind Insights</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pahami pola suasana hati dan perjalanan refleksimu berdasarkan data catatanmu sendiri.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                        <p className="text-sm">Menyiapkan ringkasan data...</p>
                    </div>
                }
            >
                <InsightsContent />
            </Suspense>
        </div>
    )
}