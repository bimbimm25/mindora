'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveMood(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const mood_type = formData.get('mood_type') as string
    const intensity = Number(formData.get('intensity'))
    const notes = (formData.get('notes') as string) || null

    const { error } = await supabase
        .from('mood_entries')
        .insert({
            user_id: user.id,
            mood_type,
            intensity,
            notes,
        })

    if (error) {
        console.error('Error saving mood:', error)
        return { error: 'Gagal menyimpan catatan mood.' }
    }

    revalidatePath('/mind-tracker')
    return { success: true }
}

export async function deleteMood(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting mood:', error)
        return { error: 'Gagal menghapus catatan.' }
    }

    revalidatePath('/mind-tracker')
    return { success: true }
}