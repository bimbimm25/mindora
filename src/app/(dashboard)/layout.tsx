import Sidebar from '@/components/layout/Sidebar'
import MobileNav from '@/components/layout/MobileNav'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-dvh bg-slate-50/70 flex flex-col md:flex-row">
            <Sidebar />

            <MobileNav />

            <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    )
}