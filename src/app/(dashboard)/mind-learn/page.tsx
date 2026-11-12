import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientLearn from './ClientLearn'
import { Loader2 } from 'lucide-react'

async function LearnContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Ambil daftar konten yang dipublikasikan
    const { data: contents } = await supabase
        .from('learning_contents')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: true })

    // Ambil progres belajar user
    const { data: progress } = await supabase
        .from('learning_progress')
        .select('content_id')
        .eq('user_id', user.id)

    const completedIds = (progress || []).map((p) => p.content_id)

    return <ClientLearn contents={contents || []} completedIds={completedIds} />
}

export default function MindLearnPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Mind Learn</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Pelajari kesehatan mental dan cara mengelola emosi dengan bahasa yang ringan dan mudah dipahami.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                        <p className="text-sm">Memuat materi edukasi...</p>
                    </div>
                }
            >
                <LearnContent />
            </Suspense>
        </div>
    )
}