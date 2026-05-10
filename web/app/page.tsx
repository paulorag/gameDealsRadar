import Link from "next/link";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-8">
            <div className="w-full max-w-4xl text-center">
                <h1 className="text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                    Game Deals Radar 🎯
                </h1>
                <p className="mb-8 text-slate-300 text-lg sm:text-xl">
                    Encontre e rastreie ofertas de jogos com um painel seguro e
                    integração com Steam.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/login"
                        className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-3 rounded-full border border-slate-700 text-white hover:border-emerald-400 hover:text-emerald-400 transition"
                    >
                        Cadastrar
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 rounded-full bg-slate-800 border border-slate-700 text-white hover:border-emerald-400 hover:text-emerald-400 transition"
                    >
                        Ver painel
                    </Link>
                </div>
            </div>
        </main>
    );
}
