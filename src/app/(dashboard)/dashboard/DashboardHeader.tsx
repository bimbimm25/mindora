'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, SmilePlus, BookHeart } from 'lucide-react'

interface DashboardHeaderProps {
    firstName: string
    latestMoodCreatedAt?: string | null
}

export default function DashboardHeader({
    firstName,
    latestMoodCreatedAt,
}: DashboardHeaderProps) {
    const [greeting, setGreeting] = useState('Selamat Datang')
    const [formattedToday, setFormattedToday] = useState('Hari Ini')
    const [hasCheckedInToday, setHasCheckedInToday] = useState(false)

    useEffect(() => {
        const now = new Date()
        const hour = now.getHours()

        if (hour >= 4 && hour < 11) setGreeting('Selamat Pagi')
        else if (hour >= 11 && hour < 15) setGreeting('Selamat Siang')
        else if (hour >= 15 && hour < 18) setGreeting('Selamat Sore')
        else setGreeting('Selamat Malam')

        setFormattedToday(
            now.toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        )

        if (latestMoodCreatedAt) {
            const todayStr = now.toLocaleDateString('en-CA')
            setHasCheckedInToday(
                new Date(latestMoodCreatedAt).toLocaleDateString('en-CA') === todayStr
            )
        }
    }, [latestMoodCreatedAt])

    return (
        <header className="bg-linear-to-br from-purple-700 via-purple-800 to-indigo-900 rounded-3xl p-5 sm:p-8 text-white shadow-md shadow-purple-950/15 relative overflow-hidden">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-[11px] font-semibold text-purple-100">
                        <Calendar className="w-3.5 h-3.5" />
                        {formattedToday}
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {greeting}, {firstName} 👋
                    </h1>

                    <p className="text-xs sm:text-sm text-purple-100/90 max-w-lg leading-relaxed">
                        {hasCheckedInToday
                            ? 'Terima kasih sudah meluangkan waktu menyapa dirimu hari ini. Bagaimana perasaanmu sekarang?'
                            : 'Bagaimana kabarmu hari ini? Luangkan 30 detik untuk mengenali suasana hatimu.'}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                    <Link
                        href="/mind-tracker"
                        className="px-5 py-3 rounded-2xl bg-white text-purple-800 hover:bg-purple-50 font-bold text-xs sm:text-sm shadow-sm transition flex items-center justify-center gap-2 active:scale-95"
                    >
                        <SmilePlus className="w-4 h-4" />
                        {hasCheckedInToday ? 'Check-in Lagi' : 'Catat Mood Hari Ini'}
                    </Link>
                    <Link
                        href="/smart-journal"
                        className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-xs border border-white/20 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 active:scale-95"
                    >
                        <BookHeart className="w-4 h-4" />
                        Tulis Jurnal
                    </Link>
                </div>
            </div>
        </header>
    )
}