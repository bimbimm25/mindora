import dns from 'node:dns'
import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'
import { createClient } from '@/lib/supabase/server'

dns.setDefaultResultOrder('ipv4first')

const MODELS = [
    'gemini-3.5-flash-lite',
    'gemini-3.8-flash',
]

export async function POST(req: Request) {
    const startTime = Date.now()
    try {
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY belum terpasang di .env.local' },
                { status: 500 }
            )
        }

        const body = await req.json()
        const messages = body?.messages
        if (!Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Pesan tidak boleh kosong' },
                { status: 400 }
            )
        }

        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: 'Sesi login berakhir. Silakan login ulang.' },
                { status: 401 }
            )
        }

        const [profileRes, moodsRes, journalsRes] = await Promise.all([
            supabase
                .from('profiles')
                .select('full_name')
                .eq('id', user.id)
                .maybeSingle(),
            supabase
                .from('mood_entries')
                .select('mood_type, intensity, notes')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(2),
            supabase
                .from('journal_entries')
                .select('title')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1),
        ])

        const userName =
            profileRes.data?.full_name ||
            user.user_metadata?.full_name ||
            user.email?.split('@')[0] ||
            'Teman MINDORA'

        const recentMoodsText =
            moodsRes.data && moodsRes.data.length > 0
                ? moodsRes.data
                    .map(
                        (m) =>
                            `${m.mood_type} (${m.intensity}/5)${m.notes ? `: "${m.notes}"` : ''
                            }`
                    )
                    .join('; ')
                : 'Belum ada'

        const recentJournalsText =
            journalsRes.data && journalsRes.data.length > 0
                ? `"${journalsRes.data[0].title}"`
                : 'Belum ada'

        const systemInstruction = `Kamu adalah "Mindora Companion", teman curhat virtual yang hangat, empatik, dan menenangkan di aplikasi MINDORA.
Konteks pengguna: Nama ${userName}, mood terakhir: ${recentMoodsText}, jurnal terakhir: ${recentJournalsText}.
Aturan:
- Gunakan bahasa Indonesia yang hangat & akrab ("aku" & "kamu").
- Validasi perasaan pengguna dulu, pahami konteks mood-nya secara alami.
- Jawab singkat dan lembut (maksimal 2 paragraf pendek) agar cepat dibaca.
- Bukan dokter/psikolog; jangan mendiagnosis. Jika ada tanda krisis berat, arahkan lembut ke Layanan SEJIWA 119 ext 8.`

        const firstUserIndex = messages.findIndex(
            (m: { role: string }) => m.role === 'user'
        )
        const validHistory = (
            firstUserIndex >= 0 ? messages.slice(firstUserIndex) : messages
        ).slice(-6)

        const formattedContents = validHistory.map(
            (msg: { role: string; text: string }) => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }],
            })
        )

        const ai = new GoogleGenAI({ apiKey })
        let replyText = ''
        let lastErrorMessage = ''

        for (const modelName of MODELS) {
            const controller = new AbortController()
            const timer = setTimeout(() => controller.abort(), 15000)

            try {
                const response = await ai.models.generateContent({
                    model: modelName,
                    contents: formattedContents,
                    config: {
                        systemInstruction,
                        temperature: 0.7,
                        maxOutputTokens: 350,
                        abortSignal: controller.signal,
                    },
                })
                clearTimeout(timer)

                if (response.text) {
                    replyText = response.text
                    console.log(
                        `[Mindora AI] Sukses dengan ${modelName} dalam ${Date.now() - startTime}ms`
                    )
                    break
                }
            } catch (err: any) {
                clearTimeout(timer)
                lastErrorMessage = err?.message || String(err)
                console.error(`[Mindora AI] Gagal pada ${modelName}:`, lastErrorMessage)
            }
        }

        if (!replyText) {
            return NextResponse.json(
                {
                    error: `AI tidak merespons (${lastErrorMessage}). Periksa kuota atau API Key di Google AI Studio.`,
                },
                { status: 503 }
            )
        }

        return NextResponse.json({ reply: replyText })
    } catch (error: any) {
        console.error('[Mindora AI] Fatal:', error)
        return NextResponse.json(
            { error: `Gagal memproses pesan: ${error?.message || 'Unknown error'}` },
            { status: 500 }
        )
    }
}