'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    SmilePlus,
    BookHeart,
    Target,
    GraduationCap,
    LineChart,
    Settings,
    MessageCircleHeart,
    Leaf,
    Sparkles,
    LayoutGrid,
    X,
    ChevronRight,
} from 'lucide-react'

const MORE_MENU_ITEMS = [
    { label: 'Mood Quest', href: '/mood-quest', icon: Target },
    { label: 'Mind Learn', href: '/mind-learn', icon: GraduationCap },
    { label: 'Mind Insights', href: '/mind-insights', icon: LineChart },
    { label: 'Pengaturan', href: '/settings', icon: Settings },
]

export default function MobileNav() {
    const pathname = usePathname()
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const isMoreActive = MORE_MENU_ITEMS.some((item) => pathname === item.href)

    return (
        <>
            {/* 1. MOBILE TOP HEADER (Hanya tampil di layar < md) */}
            <header className="md:hidden sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                        <Leaf className="w-4 h-4" />
                    </div>
                    <span className="text-base font-extrabold tracking-tight text-slate-900">
                        MINDORA
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    <Link
                        href="/mind-chat"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold active:scale-95 transition"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Curhat AI
                    </Link>

                    <Link
                        href="/settings"
                        className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center active:scale-95 transition"
                        title="Pengaturan Akun"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>
            </header>

            {/* 2. MOBILE BOTTOM TAB BAR FULL-WIDTH */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full z-40 bg-white border-t border-slate-200 px-2 pt-2 pb-2.5 shadow-[0_-4px_20px_rgba(15,23,42,0.06)]">
                <div className="grid grid-cols-5 items-end w-full">
                    {/* Tab 1: Beranda */}
                    <Link
                        href="/dashboard"
                        onClick={() => setIsDrawerOpen(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-0.5 transition ${pathname === '/dashboard'
                                ? 'text-purple-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Beranda</span>
                    </Link>

                    {/* Tab 2: Tracker */}
                    <Link
                        href="/mind-tracker"
                        onClick={() => setIsDrawerOpen(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-0.5 transition ${pathname === '/mind-tracker'
                                ? 'text-purple-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <SmilePlus className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Tracker</span>
                    </Link>

                    {/* Tab 3 (Tengah Menonjol): Curhat AI */}
                    <Link
                        href="/mind-chat"
                        onClick={() => setIsDrawerOpen(false)}
                        className="flex flex-col items-center justify-center -mt-6 group"
                    >
                        <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-active:scale-90 ${pathname === '/mind-chat'
                                    ? 'bg-purple-800 ring-4 ring-purple-100'
                                    : 'bg-purple-700 shadow-purple-700/30'
                                }`}
                        >
                            <MessageCircleHeart className="w-6 h-6 text-white" />
                        </div>
                        <span
                            className={`text-[10px] font-extrabold mt-1 ${pathname === '/mind-chat'
                                    ? 'text-purple-700'
                                    : 'text-slate-700'
                                }`}
                        >
                            Curhat AI
                        </span>
                    </Link>

                    {/* Tab 4: Jurnal */}
                    <Link
                        href="/smart-journal"
                        onClick={() => setIsDrawerOpen(false)}
                        className={`flex flex-col items-center justify-center gap-1 py-0.5 transition ${pathname === '/smart-journal'
                                ? 'text-purple-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <BookHeart className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Jurnal</span>
                    </Link>

                    {/* Tab 5: Menu Lainnya */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen((prev) => !prev)}
                        className={`flex flex-col items-center justify-center gap-1 py-0.5 transition cursor-pointer ${isDrawerOpen || isMoreActive
                                ? 'text-purple-700'
                                : 'text-slate-400 hover:text-slate-600'
                            }`}
                    >
                        <LayoutGrid className="w-5 h-5" />
                        <span className="text-[10px] font-bold">Menu</span>
                    </button>
                </div>
            </nav>

            {/* 3. MOBILE BOTTOM SHEET DRAWER */}
            {isDrawerOpen && (
                <div
                    className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-end"
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white rounded-t-3xl border-t border-slate-200 p-5 pb-8 space-y-4 shadow-2xl"
                    >
                        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto" />

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-base font-extrabold text-slate-900">
                                    Menu Lainnya
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Pilih fitur pendamping MINDORA
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsDrawerOpen(false)}
                                className="p-2 rounded-xl bg-slate-100 text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            {MORE_MENU_ITEMS.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setIsDrawerOpen(false)}
                                        className={`p-3.5 rounded-2xl border flex items-center justify-between transition active:scale-95 ${isActive
                                                ? 'bg-purple-50 border-purple-300 text-purple-800'
                                                : 'bg-slate-50 border-slate-200/80 text-slate-700'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div
                                                className={`p-2 rounded-xl shrink-0 ${isActive
                                                        ? 'bg-purple-700 text-white'
                                                        : 'bg-white text-purple-700 shadow-2xs'
                                                    }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-bold truncate">
                                                {item.label}
                                            </span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}