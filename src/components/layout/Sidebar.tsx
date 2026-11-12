import Link from 'next/link'
import {
    LayoutDashboard, Smile, BookHeart,
    Target, GraduationCap, LineChart,
    Settings, LogOut, Leaf
} from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mind Tracker', href: '/mind-tracker', icon: Smile },
    { name: 'Smart Journal', href: '/smart-journal', icon: BookHeart },
    { name: 'Mood Quest', href: '/mood-quest', icon: Target },
    { name: 'Mind Learn', href: '/mind-learn', icon: GraduationCap },
    { name: 'Mind Insights', href: '/mind-insights', icon: LineChart },
]

export default function Sidebar() {
    return (
        <aside className="hidden md:flex flex-col w-64 h-screen bg-white border-r border-slate-100 sticky top-0">
            <div className="p-6 flex items-center gap-3 text-purple-700">
                <Leaf className="w-8 h-8" />
                <h1 className="text-xl font-bold tracking-tight">MINDORA</h1>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors font-medium"
                    >
                        <item.icon className="w-5 h-5" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-colors font-medium mb-2">
                    <Settings className="w-5 h-5" />
                    Pengaturan
                </Link>
                <form action={async (_formData: FormData) => {
                    'use server'
                    await logout()
                }}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium">
                        <LogOut className="w-5 h-5" />
                        Keluar
                    </button>
                </form>
            </div>
        </aside>
    )
}