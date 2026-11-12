import { Suspense } from 'react'
import { connection } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientAdmin from './ClientAdmin'
import { Loader2 } from 'lucide-react'

async function AdminContent() {
    await connection()

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        redirect('/dashboard')
    }

    const [contentsRes, missionsRes, usersCountRes] = await Promise.all([
        supabase.from('learning_contents').select('*').order('created_at', { ascending: false }),
        supabase.from('missions').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
    ])

    return (
        <ClientAdmin
            contents={contentsRes.data || []}
            missions={missionsRes.data || []}
            totalUsers={usersCountRes.count || 0}
        />
    )
}

export default function AdminPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600 mb-2" />
                    <p className="text-sm">Memuat workspace administrator...</p>
                </div>
            }
        >
            <AdminContent />
        </Suspense>
    )
}