import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientJournal from './ClientJournal'
import { Loader2 } from 'lucide-react'

async function JournalContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    return <ClientJournal initialJournals={journals || []} />
}

export default function SmartJournalPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Smart Journal</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Tuangkan pikiran, perasaan, dan hal yang kamu syukuri dalam ruang refleksi pribadi.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mb-2" />
                        <p className="text-sm">Memuat data jurnal...</p>
                    </div>
                }
            >
                <JournalContent />
            </Suspense>
        </div>
    )
}