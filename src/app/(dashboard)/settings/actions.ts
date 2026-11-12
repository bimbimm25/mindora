'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    const full_name = (formData.get('full_name') as string)?.trim()

    if (!full_name) {
        return { error: 'Nama lengkap tidak boleh kosong.' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'Gagal memperbarui profil.' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}