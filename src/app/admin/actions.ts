'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'admin') {
        throw new Error('Forbidden: Akses khusus administrator.')
    }

    return supabase
}

// --- CRUD MATERI EDUKASI (MIND LEARN) ---

export async function createLearningContent(formData: FormData) {
    const supabase = await verifyAdmin()

    const title = (formData.get('title') as string)?.trim()
    const category = (formData.get('category') as string)?.trim()
    const content = (formData.get('content') as string)?.trim()
    const is_published = formData.get('is_published') === 'on'

    if (!title || !category || !content) {
        return { error: 'Semua kolom materi wajib diisi.' }
    }

    const { error } = await supabase.from('learning_contents').insert({
        title,
        category,
        content,
        is_published,
    })

    if (error) {
        console.error('Error creating content:', error)
        return { error: 'Gagal menambahkan materi.' }
    }

    revalidatePath('/admin')
    revalidatePath('/mind-learn')
    return { success: true }
}

export async function togglePublishContent(id: string, currentStatus: boolean) {
    const supabase = await verifyAdmin()

    const { error } = await supabase
        .from('learning_contents')
        .update({ is_published: !currentStatus })
        .eq('id', id)

    if (error) {
        console.error('Error toggling publish:', error)
        return { error: 'Gagal mengubah status publikasi.' }
    }

    revalidatePath('/admin')
    revalidatePath('/mind-learn')
    return { success: true }
}

export async function deleteLearningContent(id: string) {
    const supabase = await verifyAdmin()

    const { error } = await supabase
        .from('learning_contents')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting content:', error)
        return { error: 'Gagal menghapus materi.' }
    }

    revalidatePath('/admin')
    revalidatePath('/mind-learn')
    return { success: true }
}

// --- CRUD AKTIVITAS (MOOD QUEST) ---

export async function createMission(formData: FormData) {
    const supabase = await verifyAdmin()

    const title = (formData.get('title') as string)?.trim()
    const category = (formData.get('category') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()

    if (!title || !category || !description) {
        return { error: 'Semua kolom aktivitas wajib diisi.' }
    }

    const { error } = await supabase.from('missions').insert({
        title,
        category,
        description,
    })

    if (error) {
        console.error('Error creating mission:', error)
        return { error: 'Gagal menambahkan aktivitas.' }
    }

    revalidatePath('/admin')
    revalidatePath('/mood-quest')
    return { success: true }
}

export async function deleteMission(id: string) {
    const supabase = await verifyAdmin()

    const { error } = await supabase
        .from('missions')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting mission:', error)
        return { error: 'Gagal menghapus aktivitas.' }
    }

    revalidatePath('/admin')
    revalidatePath('/mood-quest')
    return { success: true }
}