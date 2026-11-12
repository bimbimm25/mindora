import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientQuest from './ClientQuest'
import { Loader2 } from 'lucide-react'

async function QuestContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ambil master data missions
    const { data: missions } = await supabase
        .from('missions')
        .select('*')
        .order('created_at', { ascending: true })

    // Ambil riwayat penyelesaian user beserta relasi nama & kategori mission
    const { data: completedHistory } = await supabase
        .from('user_missions')
        .select(`
      id,
      completed_at,
      missions (
        title,
        category
      )
    `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

    return (
        <ClientQuest
            missions={missions || []}
            completedHistory={completedHistory || []}
        />
    )
}

export default function MoodQuestPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mood Quest</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Langkah-langkah kecil yang santai dan suportif untuk merawat kesejahteraan dirimu.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                        <p className="text-sm">Memuat aktivitas...</p>
                    </div>
                }
            >
                <QuestContent />
            </Suspense>
        </div>
    )
}