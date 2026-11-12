'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function completeMission(missionId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('user_missions')
        .insert({
            user_id: user.id,
            mission_id: missionId,
        })

    if (error) {
        console.error('Error completing mission:', error)
        return { error: 'Gagal mencatat penyelesaian aktivitas.' }
    }

    revalidatePath('/mood-quest')
    return { success: true }
}

export async function deleteUserMission(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('user_missions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting user mission:', error)
        return { error: 'Gagal menghapus riwayat.' }
    }

    revalidatePath('/mood-quest')
    return { success: true }
}