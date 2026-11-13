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
    MessageCircleHeart,
    Leaf,
} from 'lucide-react'

const NAV_ITEMS = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Mind Tracker', href: '/mind-tracker', icon: SmilePlus },
    { label: 'Teman Curhat', href: '/mind-chat', icon: MessageCircleHeart, isAi: true },
    { label: 'Smart Journal', href: '/smart-journal', icon: BookHeart },
    { label: 'Mood Quest', href: '/mood-quest', icon: Target },
    { label: 'Mind Learn', href: '/mind-learn', icon: GraduationCap },
    { label: 'Mind Insights', href: '/mind-insights', icon: LineChart },
    { label: 'Pengaturan', href: '/settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="hidden md:flex md:flex-col md:w-64 md:shrink-0 bg-white border-r border-slate-200/80 min-h-dvh">
            {/* Brand Header */}
            <div className="px-6 py-5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                    <Leaf className="w-5 h-5" />
                </div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900">
                    MINDORA
                </span>
            </div>

            {/* Menu Navigasi */}
            <nav className="flex-1 px-3 py-2 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-purple-50 text-purple-700 font-bold'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className="flex items-center gap-3.5">
                                <Icon
                                    className={`w-5 h-5 ${isActive ? 'text-purple-700' : 'text-slate-400'
                                        }`}
                                />
                                {item.label}
                            </span>

                            {item.isAi && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-700 text-white">
                                    AI
                                </span>
                            )}

                            {isActive && !item.isAi && (
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-700" />
                            )}
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}