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
    ShieldCheck,
} from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

const MENU_ITEMS = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mind Tracker', href: '/mind-tracker', icon: SmilePlus },
    { name: 'Smart Journal', href: '/smart-journal', icon: BookHeart },
    { name: 'Mood Quest', href: '/mood-quest', icon: Target },
    { name: 'Mind Learn', href: '/mind-learn', icon: GraduationCap },
    { name: 'Mind Insights', href: '/mind-insights', icon: LineChart },
    { name: 'Pengaturan', href: '/settings', icon: Settings },
]

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
    const pathname = usePathname()

    async function handleLogout() {
        await logout()
    }

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-200/80 sticky top-0 shrink-0">
            {/* Brand Logo */}
            <div className="p-6 border-b border-slate-100">
                <Link href="/dashboard" className="flex items-center gap-2.5 text-purple-700">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-800">MINDORA</span>
                </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`group flex items-center justify-between px-3.5 py-3 rounded-xl text-sm transition-all duration-200 ${isActive
                                    ? 'bg-purple-50 text-purple-700 font-semibold shadow-2xs ring-1 ring-purple-200/70'
                                    : 'text-slate-600 font-medium hover:bg-purple-50/70 hover:text-purple-700'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <item.icon
                                    className={`w-4 h-4 transition-colors ${isActive ? 'text-purple-700' : 'text-slate-400 group-hover:text-purple-700'
                                        }`}
                                />
                                <span>{item.name}</span>
                            </div>

                            {isActive && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                            )}
                        </Link>
                    )
                })}

                {isAdmin && (
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <Link
                            href="/admin"
                            className="group flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/80 transition-all"
                        >
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            <span>Admin Panel</span>
                        </Link>
                    </div>
                )}
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-slate-100">
                <form action={handleLogout}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Keluar</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}