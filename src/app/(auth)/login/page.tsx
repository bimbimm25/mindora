'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../actions'
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        const result = await login(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-8">
            <div className="text-center mb-4 sm:mb-6">
                <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] sm:text-xs font-semibold mb-2">
                    Understand Your Mind
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Selamat datang kembali
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Masuk untuk melanjutkan jurnal dan catatan suasana hatimu
                </p>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium p-2.5 sm:p-3 rounded-xl mb-4 text-center">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="email">
                        Alamat Email
                    </label>
                    <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            placeholder="nama@email.com"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            required
                            autoComplete="current-password"
                            className="w-full pl-10 pr-11 py-2.5 bg-white text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition"
                            placeholder="Masukkan password kamu"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                            title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm py-2.5 sm:py-3 rounded-xl transition shadow-sm flex justify-center items-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Masuk ke MINDORA <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-4 sm:mt-6 pt-3.5 sm:pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Belum punya akun MINDORA?{' '}
                <Link href="/register" className="text-purple-700 font-semibold hover:underline">
                    Daftar gratis sekarang
                </Link>
            </div>
        </div>
    )
}