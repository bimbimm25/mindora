'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveJournal(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const title = (formData.get('title') as string) || 'Refleksi Tanpa Judul'
    const content = formData.get('content') as string
    const prompt_used = (formData.get('prompt_used') as string) || null

    if (!content || content.trim() === '') {
        return { error: 'Isi jurnal tidak boleh kosong.' }
    }

    const { error } = await supabase
        .from('journal_entries')
        .insert({
            user_id: user.id,
            title,
            content,
            prompt_used,
        })

    if (error) {
        console.error('Error saving journal:', error)
        return { error: 'Gagal menyimpan jurnal.' }
    }

    revalidatePath('/smart-journal')
    return { success: true }
}

export async function deleteJournal(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) {
        console.error('Error deleting journal:', error)
        return { error: 'Gagal menghapus jurnal.' }
    }

    revalidatePath('/smart-journal')
    return { success: true }
}