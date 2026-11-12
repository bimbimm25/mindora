'use client'

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
    Leaf,
    LogOut,
} from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

const MOBILE_MENU = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tracker', href: '/mind-tracker', icon: SmilePlus },
    { name: 'Journal', href: '/smart-journal', icon: BookHeart },
    { name: 'Quest', href: '/mood-quest', icon: Target },
    { name: 'Learn', href: '/mind-learn', icon: GraduationCap },
    { name: 'Insights', href: '/mind-insights', icon: LineChart },
]

export default function MobileNav() {
    const pathname = usePathname()
    const isSettingsActive =
        pathname === '/settings' || pathname.startsWith('/settings/')

    async function handleLogout() {
        await logout()
    }

    return (
        <>
            {/* 1. MOBILE TOP HEADER (LOGO + SETTINGS GEAR + LOGOUT) */}
            <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2 text-purple-700">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Leaf className="w-5 h-5" />
                    </div>
                    <span className="text-base font-bold tracking-tight text-slate-800">
                        MINDORA
                    </span>
                </Link>

                <div className="flex items-center gap-2">
                    {/* Tombol Settings (Ikon Gerigi) */}
                    <Link
                        href="/settings"
                        className={`p-2 rounded-xl transition-all duration-200 active:scale-90 ${isSettingsActive
                                ? 'bg-purple-700 text-white shadow-sm shadow-purple-700/20'
                                : 'bg-slate-100/80 text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                            }`}
                        title="Pengaturan & Profil"
                    >
                        <Settings
                            className={`w-5 h-5 transition-transform duration-300 ${isSettingsActive ? 'rotate-45' : ''
                                }`}
                        />
                    </Link>

                    {/* Tombol Keluar (Logout) */}
                    <form action={handleLogout}>
                        <button
                            type="submit"
                            className="p-2 rounded-xl bg-slate-100/80 text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 active:scale-90 cursor-pointer"
                            title="Keluar"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </header>

            {/* 2. MOBILE BOTTOM NAVIGATION (6 MENU PAS 1 LAYAR TANPA SCROLL) */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-1.5 pt-2.5 pb-2 grid grid-cols-6 items-end gap-1 z-50 shadow-[0_-4px_20px_-6px_rgba(15,23,42,0.06)]">
                {MOBILE_MENU.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group relative flex flex-col items-center justify-center py-1.5 px-0.5 rounded-2xl transition-all duration-300 ease-out active:scale-90 ${isActive
                                    ? '-translate-y-2 bg-purple-700 text-white shadow-lg shadow-purple-700/25 ring-4 ring-white'
                                    : 'text-slate-500 hover:text-purple-700 hover:bg-purple-50/70'
                                }`}
                        >
                            <item.icon
                                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ease-out ${isActive
                                        ? 'scale-110 text-white'
                                        : 'group-hover:-translate-y-0.5 group-hover:text-purple-700'
                                    }`}
                            />
                            <span
                                className={`text-[9px] mt-1 truncate max-w-full transition-all duration-300 ${isActive ? 'font-bold text-white' : 'font-medium'
                                    }`}
                            >
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </nav>
        </>
    )
}