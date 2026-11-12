'use client'

import Link from 'next/link'
import {
    LayoutDashboard,
    GraduationCap,
    Target,
    ArrowLeft,
    Leaf,
    ShieldCheck,
} from 'lucide-react'

export type AdminSection = 'overview' | 'learn' | 'quest'

interface AdminNavProps {
    activeSection: AdminSection
    onSelectSection: (section: AdminSection) => void
    counts: {
        contents: number
        missions: number
    }
}

export default function AdminNav({
    activeSection,
    onSelectSection,
    counts,
}: AdminNavProps) {
    const menuItems: {
        id: AdminSection
        label: string
        mobileLabel: string
        icon: any
        badge?: number
    }[] = [
            {
                id: 'overview',
                label: 'Ringkasan Admin',
                mobileLabel: 'Ringkasan',
                icon: LayoutDashboard,
            },
            {
                id: 'learn',
                label: 'Materi Mind Learn',
                mobileLabel: 'Materi',
                icon: GraduationCap,
                badge: counts.contents,
            },
            {
                id: 'quest',
                label: 'Aktivitas Mood Quest',
                mobileLabel: 'Quest',
                icon: Target,
                badge: counts.missions,
            },
        ]

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200/80 sticky top-0 shrink-0">
                <div className="p-6 border-b border-slate-100">
                    <div className="flex items-center gap-2.5 text-purple-700">
                        <Leaf className="w-7 h-7" />
                        <span className="text-xl font-bold tracking-tight">MINDORA</span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Admin Workspace
                    </div>
                </div>

                <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = activeSection === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => onSelectSection(item.id)}
                                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                        ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs ring-1 ring-purple-200/70'
                                        : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                                    }`}
                            >
                                <span className="flex items-center gap-3">
                                    <item.icon
                                        className={`w-4 h-4 ${isActive ? 'text-purple-700' : 'text-slate-400'
                                            }`}
                                    />
                                    {item.label}
                                </span>
                                {item.badge !== undefined && (
                                    <span
                                        className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${isActive
                                                ? 'bg-purple-700 text-white'
                                                : 'bg-slate-100 text-slate-600'
                                            }`}
                                    >
                                        {item.badge}
                                    </span>
                                )}
                            </button>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke App
                    </Link>
                </div>
            </aside>

            {/* MOBILE TOP HEADER */}
            <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-40 flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-700">
                    <Leaf className="w-6 h-6" />
                    <span className="font-bold text-base tracking-tight">MINDORA</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-purple-100 text-purple-700 rounded-md">
                        Admin
                    </span>
                </div>
                <Link
                    href="/dashboard"
                    className="text-xs font-semibold text-slate-600 hover:text-purple-700 flex items-center gap-1"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> App
                </Link>
            </header>

            {/* MOBILE BOTTOM NAVIGATION (FLOATING ACTIVE TAB + SMOOTH ANIMATION) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 pt-1.5 pb-2.5 flex justify-around items-end gap-2 z-50 shadow-[0_-4px_20px_-6px_rgba(15,23,42,0.06)]">
                {menuItems.map((item) => {
                    const isActive = activeSection === item.id
                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelectSection(item.id)}
                            className={`group relative flex flex-col items-center justify-center flex-1 py-1.5 px-2 rounded-2xl transition-all duration-300 ease-out active:scale-90 cursor-pointer ${isActive
                                    ? '-translate-y-2.5 bg-purple-700 text-white shadow-lg shadow-purple-700/25 ring-4 ring-white'
                                    : 'text-slate-500 hover:text-purple-700 hover:bg-purple-50/70'
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-transform duration-300 ease-out ${isActive
                                        ? 'scale-110 text-white'
                                        : 'group-hover:-translate-y-0.5 group-hover:text-purple-700'
                                    }`}
                            />
                            <span
                                className={`text-[11px] mt-1 transition-all duration-300 ${isActive ? 'font-bold text-white' : 'font-medium'
                                    }`}
                            >
                                {item.mobileLabel}
                            </span>
                        </button>
                    )
                })}
            </nav>
        </>
    )
}