import { ReactNode } from 'react'
import { Leaf } from 'lucide-react'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center items-center gap-2 mb-8 text-slate-800">
                    <Leaf className="w-8 h-8 text-emerald-600" />
                    <h1 className="text-2xl font-bold tracking-tight">MINDORA</h1>
                </div>
                {children}
            </div>
        </div>
    )
}