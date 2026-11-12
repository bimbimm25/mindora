import { ReactNode } from 'react'
import Link from 'next/link'
import { Leaf, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="h-dvh w-full overflow-hidden bg-linear-to-br from-purple-50/70 via-[#F8FAFC] to-emerald-50/70 flex flex-col justify-between px-4 py-3 sm:px-6 sm:py-5">
            {/* Top Bar */}
            <header className="max-w-5xl w-full mx-auto flex items-center justify-between shrink-0">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-purple-700 bg-white/80 backdrop-blur-xs px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200/80 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Beranda
                </Link>

                <Link href="/" className="flex items-center gap-2 text-purple-700">
                    <div className="p-1.5 bg-purple-100 rounded-lg">
                        <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <span className="text-base sm:text-lg font-bold tracking-tight text-slate-800">
                        MINDORA
                    </span>
                </Link>

                <div className="w-16 sm:w-20 hidden sm:block" />
            </header>

            {/* Center Auth Card */}
            <main className="w-full max-w-md mx-auto flex-1 flex items-center justify-center min-h-0">
                <div className="w-full">{children}</div>
            </main>

            {/* Bottom Trust Note */}
            <footer className="text-center shrink-0">
                <p className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500">
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    Ruang aman & privat untuk refleksi kesehatan mentalmu
                </p>
            </footer>
        </div>
    )
}