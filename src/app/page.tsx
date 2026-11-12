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
} from 'lucide-react'

const FEATURES = [
  {
    title: 'Mind Tracker',
    desc: 'Catat suasana hati harian beserta intensitas dan pemicunya tanpa tekanan.',
    icon: SmilePlus,
    badgeBg: 'bg-purple-50 text-purple-700',
  },
  {
    title: 'Smart Journal',
    desc: 'Ruang refleksi pribadi dengan panduan pertanyaan untuk mengurai isi pikiran.',
    icon: BookHeart,
    badgeBg: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Mood Quest',
    desc: 'Rekomendasi aktivitas sederhana untuk merawat diri tanpa sistem poin atau kompetisi.',
    icon: Target,
    badgeBg: 'bg-amber-50 text-amber-700',
  },
  {
    title: 'Mind Learn',
    desc: 'Materi edukasi kesehatan mental yang ringan, empatik, dan mudah dipahami.',
    icon: GraduationCap,
    badgeBg: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Mind Insights',
    desc: 'Visualisasi grafik pola emosimu berdasarkan catatan nyata untuk mengenal diri lebih baik.',
    icon: LineChart,
    badgeBg: 'bg-violet-50 text-violet-700',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col">
      {/* NAVBAR */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-purple-700">
            <Leaf className="w-7 h-7" />
            <span className="text-xl font-bold tracking-tight">MINDORA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#fitur" className="hover:text-purple-700 transition">
              Fitur Utama
            </a>
            <a href="#privasi" className="hover:text-purple-700 transition">
              Keamanan & Privasi
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-purple-700 transition"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl transition shadow-sm"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-semibold mb-6">
            <HeartHandshake className="w-4 h-4" />
            Ruang Aman untuk Kesejahteraan Emosionalmu
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
            Understand Your Mind.{' '}
            <span className="text-purple-700">Take Care of Yourself.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            MINDORA membantumu mengenali suasana hati, menulis refleksi pribadi dengan aman, dan membangun kebiasaan positif sehari-hari sesuai ritmemu sendiri.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/register"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-2xl transition shadow-sm flex items-center justify-center gap-2"
            >
              Buat Akun Sekarang <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-2xl transition"
            >
              Sudah Punya Akun
            </Link>
          </div>
        </section>

        {/* FITUR UTAMA */}
        <section id="fitur" className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Lima Pendamping Perjalanan Emosionalmu
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Dirancang sederhana, menenangkan, dan bebas dari tekanan target atau kompetisi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:border-purple-200 transition"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.badgeBg}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* KEAMANAN & DISCLAIMER */}
        <section id="privasi" className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Privasi Jurnal & Catatanmu Adalah Prioritas
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                Setiap catatan suasana hati dan jurnal refleksi dilindungi kebijakan Row Level Security (RLS) di database. Hanya kamu yang memiliki akses untuk membaca dan mengelola tulisan pribadimu.
              </p>
            </div>
          </div>

          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 flex items-start gap-3 text-xs text-slate-600">
            <Info className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Catatan Penting:</strong> MINDORA adalah platform pendukung refleksi diri dan edukasi kesehatan mental. Aplikasi ini <strong>bukan alat diagnosis medis</strong> dan <strong>bukan pengganti konsultasi psikolog maupun psikiater</strong>. Jika kamu sedang mengalami krisis atau membutuhkan bantuan profesional, segera hubungi tenaga profesional atau layanan bantuan terdekat.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200/80 py-8 mt-12">
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