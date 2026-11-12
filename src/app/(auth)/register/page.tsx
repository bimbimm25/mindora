'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '../actions'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        setError(null)
        const result = await signup(formData)
        if (result?.error) {
            setError(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Buat akun baru</h2>
                <p className="text-sm text-slate-500 mt-1">Mulai perjalanan kesejahteraan emosionalmu</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
                    {error}
                </div>
            )}

            <form action={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="fullName">Nama Lengkap</label>
                    <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        placeholder="Bima Ardiansyah"
                    />
                </div>
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
                        minLength={6}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition"
                        placeholder="Minimal 6 karakter"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition flex justify-center items-center"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Daftar'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-500">
                Sudah punya akun?{' '}
                <Link href="/login" className="text-emerald-600 font-medium hover:underline">
                    Masuk di sini
                </Link>
            </div>
        </div>
    )
}