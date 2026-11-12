import { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
            <Sidebar />
            <MobileNav />
            <main className="flex-1 w-full max-w-full overflow-x-hidden p-4 md:p-8 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    )
}