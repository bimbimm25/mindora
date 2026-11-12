import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientSettings from './ClientSettings'
import { Loader2 } from 'lucide-react'

async function SettingsContent() {
    await connection()

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

    return (
        <ClientSettings
            email={user.email || ''}
            initialFullName={profile?.full_name || ''}
        />
    )
}

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Pengaturan</h1>
                <p className="text-sm text-slate-500 mt-1">
                    Kelola profil akun dan pelajari bagaimana MINDORA melindungi privasi datamu.
                </p>
            </div>

            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center min-h-[40vh] text-slate-500">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                        <p className="text-sm">Memuat pengaturan...</p>
                    </div>
                }
            >
                <SettingsContent />
            </Suspense>
        </div>
    )
}