import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientTracker from './ClientTracker'
import { Loader2 } from 'lucide-react'

async function TrackerContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return <ClientTracker historyData={moodEntries || []} />
}

export default function MindTrackerPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mind Tracker</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Catat dan amati perkembangan emosionalmu hari demi hari.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                        <p className="text-sm">Memuat data mood...</p>
                    </div>
                }
            >
                <TrackerContent />
            </Suspense>
        </div>
    )
}