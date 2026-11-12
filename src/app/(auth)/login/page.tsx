'use client'

import { useState } from 'react'
import Link from 'next/link'
import { login } from '../actions'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Selamat datang kembali</h2>
                <p className="text-sm text-slate-500 mt-1">Masuk untuk melanjutkan jurnalmu</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        placeholder="nama@email.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition flex justify-center items-center"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                Belum punya akun?{' '}
                <Link href="/register" className="text-emerald-600 font-medium hover:underline">
                    Daftar sekarang
                </Link>
            </div>
        </div>
    )
}