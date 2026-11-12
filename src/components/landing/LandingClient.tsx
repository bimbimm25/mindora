'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
    Leaf,
    SmilePlus,
    BookHeart,
    Target,
    GraduationCap,
    LineChart,
    ShieldCheck,
    ArrowRight,
    HeartHandshake,
    Info,
    Sparkles,
    Menu,
    X,
    CheckCircle2,
    Lock,
} from 'lucide-react'

const FEATURES = [
    {
        title: 'Mind Tracker',
        desc: 'Catat suasana hati harian beserta tingkat intensitasnya tanpa tekanan atau penilaian.',
        icon: SmilePlus,
        badgeBg: 'bg-purple-50 text-purple-700',
        borderHover: 'hover:border-purple-300',
    },
    {
        title: 'Smart Journal',
        desc: 'Ruang menulis pribadi dengan panduan pertanyaan reflektif untuk mengurai isi pikiran.',
        icon: BookHeart,
        badgeBg: 'bg-emerald-50 text-emerald-700',
        borderHover: 'hover:border-emerald-300',
    },
    {
        title: 'Mood Quest',
        desc: 'Rekomendasi langkah kecil merawat diri tanpa sistem poin, peringkat, atau paksaan.',
        icon: Target,
        badgeBg: 'bg-amber-50 text-amber-700',
        borderHover: 'hover:border-amber-300',
    },
    {
        title: 'Mind Learn',
        desc: 'Bacaan ringan seputar kesehatan mental dan pengelolaan emosi dengan bahasa empatik.',
        icon: GraduationCap,
        badgeBg: 'bg-sky-50 text-sky-700',
        borderHover: 'hover:border-sky-300',
    },
    {
        title: 'Mind Insights',
        desc: 'Grafik visual dari catatan nyatamu sendiri untuk mengenali pola emosi dari waktu ke waktu.',
        icon: LineChart,
        badgeBg: 'bg-violet-50 text-violet-700',
        borderHover: 'hover:border-violet-300',
    },
]

const INTERACTIVE_MOODS = [
    {
        id: 'cemas',
        emoji: '😰',
        label: 'Cemas',
        color: 'bg-purple-50 border-purple-300 text-purple-800',
        validation:
            'Wajar jika pikiran terasa penuh saat menghadapi ketidakpastian. Kamu tidak harus menyelesaikan semuanya detik ini.',
        journalPrompt:
            '“Hal spesifik apa yang paling membuatku khawatir hari ini, dan mana bagian yang masih bisa kukendalikan?”',
        questSuggestion:
            'Tarik napas perlahan selama 4 detik, tahan 4 detik, dan embuskan 6 detik sebanyak 3 kali.',
    },
    {
        id: 'lelah',
        emoji: '🥱',
        label: 'Lelah',
        color: 'bg-slate-100 border-slate-300 text-slate-800',
        validation:
            'Rasa lelah adalah sinyal tubuh dan pikiranmu meminta jeda. Beristirahat bukan berarti tertinggal.',
        journalPrompt:
            '“Aktivitas apa yang paling menguras energiku minggu ini, dan batas sehat apa yang perlu kubuat?”',
        questSuggestion:
            'Jauhkan layar gawai selama 10 menit dan minum segelas air putih dengan tenang.',
    },
    {
        id: 'tenang',
        emoji: '🌿',
        label: 'Tenang',
        color: 'bg-emerald-50 border-emerald-300 text-emerald-800',
        validation:
            'Senang mengetahui hatimu terasa lebih lapang hari ini. Nikmati momen jeda yang damai ini.',
        journalPrompt:
            '“Kebiasaan atau hal sederhana apa yang membuatku merasa cukup tenang hari ini?”',
        questSuggestion:
            'Tuliskan 1 hal kecil yang kamu syukuri dari dirimu sendiri hari ini.',
    },
    {
        id: 'bahagia',
        emoji: '😊',
        label: 'Bahagia',
        color: 'bg-amber-50 border-amber-300 text-amber-800',
        validation:
            'Momen hangat seperti ini layak dicatat sebagai pengingat bahwa hari-hari baik selalu bisa hadir.',
        journalPrompt:
            '“Siapa atau momen apa yang membawa senyum di hariku, dan bagaimana aku ingin merayakannya?”',
        questSuggestion:
            'Bagikan pesan apresiasi singkat kepada seseorang yang berarti bagimu.',
    },
]

const STEPS = [
    {
        step: '01',
        title: 'Kenali Suasana Hatimu',
        desc: 'Luangkan 30 detik memilih emosi yang sedang hadir dan seberapa kuat kamu merasakannya.',
    },
    {
        step: '02',
        title: 'Urai Isi Pikiran dengan Aman',
        desc: 'Tuangkan perasaanmu ke dalam Smart Journal privat yang hanya bisa dibuka oleh akunmu sendiri.',
    },
    {
        step: '03',
        title: 'Rawat Diri Sesuai Ritmemu',
        desc: 'Ikuti aktivitas ringan di Mood Quest atau pahami pola emosimu secara perlahan lewat Mind Insights.',
    },
]

export default function LandingClient() {
    const [selectedMood, setSelectedMood] = useState(INTERACTIVE_MOODS[0])
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const sectionsRef = useRef<(HTMLElement | null)[]>([])

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 16)
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.remove('opacity-0', 'translate-y-6')
                        entry.target.classList.add('opacity-100', 'translate-y-0')
                        observer.unobserve(entry.target)
                    }
                })
            },
            { threshold: 0.12 }
        )

        sectionsRef.current.forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [])

    return (
        <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col selection:bg-purple-200 selection:text-purple-900">
            {/* NAVBAR: FLOATING DI MOBILE & FULL-WIDTH GLASS DI DESKTOP */}
            <header
                className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                        ? 'pt-2 px-3 md:pt-0 md:px-0 md:bg-white/90 md:backdrop-blur-lg md:border-b md:border-slate-200/80 md:shadow-xs'
                        : 'pt-3 px-3 md:pt-0 md:px-0 md:bg-transparent md:border-b md:border-transparent'
                    }`}
            >
                <div
                    className={`max-w-6xl mx-auto transition-all duration-300 flex items-center justify-between ${isScrolled
                            ? 'bg-white/95 md:bg-transparent backdrop-blur-lg border border-slate-200/90 md:border-none rounded-2xl md:rounded-none shadow-md shadow-slate-900/5 md:shadow-none px-4 sm:px-6 h-14 md:h-16'
                            : 'bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border border-slate-200/80 md:border-none rounded-2xl md:rounded-none shadow-sm md:shadow-none px-4 sm:px-6 h-14 md:h-20'
                        }`}
                >
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-2.5 text-purple-700 group shrink-0">
                        <div className="p-1.5 sm:p-2 bg-purple-100 rounded-xl group-hover:scale-105 transition-transform">
                            <Leaf className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base md:text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                                MINDORA
                            </span>
                            <span className="md:hidden text-[9px] font-medium text-slate-500 mt-0.5">
                                Mental Wellness
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation (Pill Container di Tengah) */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/80 backdrop-blur-md border border-slate-200/80 px-2 py-1.5 rounded-full shadow-2xs">
                        <a
                            href="#simulasi"
                            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 transition-all"
                        >
                            Coba Simulasi
                        </a>
                        <a
                            href="#cara-kerja"
                            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 transition-all"
                        >
                            Cara Kerja
                        </a>
                        <a
                            href="#fitur"
                            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 transition-all"
                        >
                            Fitur Utama
                        </a>
                        <a
                            href="#privasi"
                            className="px-4 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50/80 transition-all"
                        >
                            Privasi
                        </a>
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-2.5 shrink-0">
                        <Link
                            href="/login"
                            className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 rounded-xl transition"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="px-5 py-2.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition shadow-sm shadow-purple-700/20 active:scale-95 flex items-center gap-1.5"
                        >
                            Mulai Gratis <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Quick Actions */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link
                            href="/login"
                            className="px-3 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl transition active:scale-95"
                        >
                            Masuk
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer active:scale-90 ${mobileMenuOpen
                                    ? 'bg-purple-700 text-white border-purple-700 shadow-sm'
                                    : 'bg-slate-50 text-slate-700 border-slate-200/80 hover:bg-slate-100'
                                }`}
                            aria-label="Buka menu navigasi"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Floating Dropdown Card */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-2 bg-white/95 backdrop-blur-lg border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-3.5 space-y-3 animate-fade-up">
                        <nav className="grid grid-cols-1 gap-1.5">
                            <a
                                href="#simulasi"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-purple-50/80 transition group"
                            >
                                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:scale-105 transition-transform">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">
                                        Coba Simulasi Interaktif
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Rasakan respons MINDORA sesuai mood-mu
                                    </p>
                                </div>
                            </a>

                            <a
                                href="#cara-kerja"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-emerald-50/80 transition group"
                            >
                                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                                    <HeartHandshake className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                                        Cara Kerja MINDORA
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        3 langkah sederhana merawat diri tiap hari
                                    </p>
                                </div>
                            </a>

                            <a
                                href="#fitur"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/80 transition group"
                            >
                                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:scale-105 transition-transform">
                                    <SmilePlus className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                                        Lima Fitur Utama
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Tracker, Journal, Quest, Learn & Insights
                                    </p>
                                </div>
                            </a>

                            <a
                                href="#privasi"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-sky-50/80 transition group"
                            >
                                <div className="p-2 rounded-lg bg-sky-100 text-sky-700 group-hover:scale-105 transition-transform">
                                    <ShieldCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-800 group-hover:text-sky-700">
                                        Keamanan & Privasi
                                    </p>
                                    <p className="text-[11px] text-slate-500">
                                        Perlindungan RLS & batas etis aplikasi
                                    </p>
                                </div>
                            </a>
                        </nav>

                        <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2">
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition"
                            >
                                Masuk Akun
                            </Link>
                            <Link
                                href="/register"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex-1 py-2.5 text-center text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
                            >
                                Daftar Gratis <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative overflow-hidden bg-linear-to-b from-purple-50/70 via-[#F8FAFC] to-[#F8FAFC] pt-14 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="animate-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-6">
                            <HeartHandshake className="w-4 h-4" />
                            Ruang Aman & Privat untuk Kesejahteraan Emosionalmu
                        </div>

                        <h1 className="animate-fade-up-delay-1 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                            Understand Your Mind.{' '}
                            <span className="text-purple-700 block sm:inline">
                                Take Care of Yourself.
                            </span>
                        </h1>

                        <p className="animate-fade-up-delay-2 mt-5 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            MINDORA membantumu mengenali suasana hati, menulis refleksi pribadi tanpa rasa takut dihakimi, dan merawat diri secara perlahan sesuai ritmemu sendiri.
                        </p>

                        <div className="animate-fade-up-delay-3 mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-2xl transition-all shadow-md shadow-purple-700/20 flex items-center justify-center gap-2 active:scale-95"
                            >
                                Mulai Perjalananmu <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#simulasi"
                                className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 rounded-2xl transition-all"
                            >
                                Coba Simulasi Interaktif
                            </a>
                        </div>

                        {/* Trust Badges */}
                        <div className="animate-fade-up-delay-3 mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Gratis digunakan
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Lock className="w-4 h-4 text-purple-600" /> Jurnal terenkripsi RLS
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Bebas tekanan & tanpa iklan
                            </span>
                        </div>
                    </div>
                </section>

                {/* 2. SIMULASI INTERAKTIF (LIVE DEMO) */}
                <section
                    id="simulasi"
                    ref={(el) => {
                        sectionsRef.current[0] = el
                    }}
                    className="opacity-0 translate-y-6 transition-all duration-700 ease-out max-w-5xl mx-auto px-4 sm:px-6 py-12"
                >
                    <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50/80 border-b border-slate-200/80 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <div>
                                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 uppercase tracking-wider">
                                    <Sparkles className="w-3.5 h-3.5" /> Pratinjau Interaktif
                                </span>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-0.5">
                                    Bagaimana perasaanmu saat ini? Coba klik salah satu:
                                </h2>
                            </div>
                            <span className="text-xs text-slate-500">
                                Simulasi langsung tanpa perlu login
                            </span>
                        </div>

                        <div className="p-6 sm:p-8 space-y-6">
                            {/* Pilihan Emosi Interaktif */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {INTERACTIVE_MOODS.map((mood) => {
                                    const isSelected = selectedMood.id === mood.id
                                    return (
                                        <button
                                            key={mood.id}
                                            type="button"
                                            onClick={() => setSelectedMood(mood)}
                                            className={`p-4 rounded-2xl border text-center transition-all duration-300 cursor-pointer active:scale-95 ${isSelected
                                                    ? `${mood.color} shadow-sm -translate-y-1 font-bold ring-2 ring-purple-600/20`
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            <span className="text-3xl block mb-1.5 transition-transform duration-300">
                                                {mood.emoji}
                                            </span>
                                            <span className="text-sm">{mood.label}</span>
                                        </button>
                                    )
                                })}
                            </div>

                            {/* Hasil Respons Dinamis dari 3 Modul MINDORA */}
                            <div
                                key={selectedMood.id}
                                className="animate-fade-up grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                            >
                                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                    <p className="text-xs font-bold text-purple-700 mb-1.5 flex items-center gap-1.5">
                                        <SmilePlus className="w-4 h-4" /> 1. Validasi Mind Tracker
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        {selectedMood.validation}
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                                    <p className="text-xs font-bold text-emerald-700 mb-1.5 flex items-center gap-1.5">
                                        <BookHeart className="w-4 h-4" /> 2. Panduan Smart Journal
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                                        {selectedMood.journalPrompt}
                                    </p>
                                </div>

                                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-100">
                                    <p className="text-xs font-bold text-amber-700 mb-1.5 flex items-center gap-1.5">
                                        <Target className="w-4 h-4" /> 3. Saran Mood Quest
                                    </p>
                                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                        {selectedMood.questSuggestion}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. CARA KERJA SEDERHANA */}
                <section
                    id="cara-kerja"
                    ref={(el) => {
                        sectionsRef.current[1] = el
                    }}
                    className="opacity-0 translate-y-6 transition-all duration-700 ease-out max-w-6xl mx-auto px-4 sm:px-6 py-16"
                >
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Tiga Langkah Sederhana Setiap Hari
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Tidak perlu menulis panjang atau mengejar target—cukup hadir untuk dirimu sendiri.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {STEPS.map((item) => (
                            <div
                                key={item.step}
                                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform duration-300"
                            >
                                <span className="inline-block text-xs font-extrabold px-3 py-1 rounded-lg bg-purple-100 text-purple-700 mb-4">
                                    Langkah {item.step}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. LIMA FITUR UTAMA */}
                <section
                    id="fitur"
                    ref={(el) => {
                        sectionsRef.current[2] = el
                    }}
                    className="opacity-0 translate-y-6 transition-all duration-700 ease-out max-w-6xl mx-auto px-4 sm:px-6 py-12"
                >
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                            Lima Modul Pendamping Kesejahteraanmu
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Dirancang khusus agar mudah dipahami siapa saja dengan tampilan yang tenang.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((item) => (
                            <div
                                key={item.title}
                                className={`group bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 ${item.borderHover}`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform ${item.badgeBg}`}
                                >
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 5. KEAMANAN & DISCLAIMER ETIS */}
                <section
                    id="privasi"
                    ref={(el) => {
                        sectionsRef.current[3] = el
                    }}
                    className="opacity-0 translate-y-6 transition-all duration-700 ease-out max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-4"
                >
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start gap-4">
                        <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0 animate-float-slow">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900">
                                Privasi Jurnal & Catatanmu Adalah Prioritas Utama
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                                Setiap catatan suasana hati dan tulisan jurnal refleksi dilindungi oleh kebijakan keamanan tingkat baris (Row Level Security) di database. Hanya akunmu yang memiliki kunci akses untuk membaca dan mengelola tulisan pribadimu.
                            </p>
                        </div>
                    </div>

                    <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-5 flex items-start gap-3 text-xs text-slate-600">
                        <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                            <strong>Catatan Penting:</strong> MINDORA adalah platform pendukung refleksi diri dan edukasi kesehatan mental. Aplikasi ini <strong>bukan alat diagnosis medis</strong> dan <strong>bukan pengganti konsultasi psikolog maupun psikiater</strong>. Jika kamu sedang mengalami krisis atau membutuhkan bantuan profesional, segera hubungi tenaga profesional atau layanan bantuan terdekat.
                        </p>
                    </div>
                </section>

                {/* 6. FINAL CTA BANNER */}
                <section className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
                    <div className="bg-gradient-to-r from-purple-700 to-purple-800 rounded-3xl p-8 sm:p-12 text-center text-white shadow-lg shadow-purple-700/15">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Siap Mulai Mengenali Diri Lebih Baik?
                        </h2>
                        <p className="text-xs sm:text-sm text-purple-100 mt-2.5 max-w-xl mx-auto leading-relaxed">
                            Buat akun gratis dalam hitungan detik dan mulailah mencatat perjalanan emosionalmu di ruang yang aman.
                        </p>
                        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/register"
                                className="w-full sm:w-auto px-7 py-3.5 bg-white text-purple-800 hover:bg-purple-50 font-bold text-sm rounded-2xl transition shadow-sm flex items-center justify-center gap-2 active:scale-95"
                            >
                                Daftar Gratis Sekarang <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            {/* FOOTER */}
            <footer className="bg-white border-t border-slate-200/80 py-8 mt-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-2 font-semibold text-slate-700">
                        <Leaf className="w-4 h-4 text-purple-700" />
                        <span>MINDORA — Understand Your Mind. Take Care of Yourself.</span>
                    </div>
                    <p>© 2026 MINDORA. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}