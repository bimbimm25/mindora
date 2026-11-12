'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleCompleteContent(contentId: string, isCurrentlyCompleted: boolean) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('Unauthorized')

    if (isCurrentlyCompleted) {
        const { error } = await supabase
            .from('learning_progress')
            .delete()
            .eq('user_id', user.id)
            .eq('content_id', contentId)

        if (error) {
            console.error('Error removing progress:', error)
            return { error: 'Gagal memperbarui status belajar.' }
        }
    } else {
        const { error } = await supabase
            .from('learning_progress')
            .insert({
                user_id: user.id,
                content_id: contentId,
            })

        if (error) {
            console.error('Error saving progress:', error)
            return { error: 'Gagal menyimpan progres belajar.' }
        }
    }

    revalidatePath('/mind-learn')
    return { success: true }
}