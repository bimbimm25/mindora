import Link from 'next/link'
import { LayoutDashboard, Smile, BookHeart, Target, GraduationCap } from 'lucide-react'

// Hanya menampilkan 5 menu utama di mobile agar tidak sesak
const mobileItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Tracker', href: '/mind-tracker', icon: Smile },
    { name: 'Journal', href: '/smart-journal', icon: BookHeart },
    { name: 'Quest', href: '/mood-quest', icon: Target },
    { name: 'Learn', href: '/mind-learn', icon: GraduationCap },
]

export default function MobileNav() {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 py-2 flex justify-between items-center z-50 pb-safe">
            {mobileItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-purple-700 transition-colors flex-1"
                >
                    <item.icon className="w-6 h-6" />
                    <span className="text-[10px] font-medium">{item.name}</span>
                </Link>
            ))}
        </nav>
    )
}