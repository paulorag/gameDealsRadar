import Link from "next/link";
import PopularGamesPanel from "./components/PopularGamesPanel";

export default function Home() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-8">
            <div className="w-full max-w-6xl space-y-12">
                <section className="rounded-[36px] border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                    <div className="text-center">
                        <p className="text-sm uppercase tracking-[0.35em] text-emerald-400/80">
                            Radar de ofertas
                        </p>
                        <h1 className="mt-4 text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                            Game Deals Radar 🎯
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-slate-300 text-lg sm:text-xl leading-8">
                            Monitore preços, receba alertas e veja o histórico
                            de jogos da Steam. Um painel rápido, elegante e
                            focado em sua coleção.
                        </p>
                    </div>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-8 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
                        >
                            Entrar
                        </Link>
                        <Link
                            href="/signup"
                            className="inline-flex items-center justify-center rounded-full border border-slate-700 px-8 py-3 text-sm font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                        >
                            Criar conta
                        </Link>
                        <Link
                            href="/dashboard"
                            className="inline-flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 px-8 py-3 text-sm font-semibold text-white transition hover:border-emerald-400 hover:text-emerald-400"
                        >
                            Ver painel
                        </Link>
                    </div>
                </section>

                <PopularGamesPanel />

                <section className="grid gap-6 lg:grid-cols-3">
                    {[
                        {
                            title: "Rastreamento contínuo",
                            description:
                                "Adicione jogos da Steam e acompanhe automaticamente o histórico de preços.",
                        },
                        {
                            title: "Painel intuitivo",
                            description:
                                "Organize sua lista em cards claros e modernos com ações rápidas.",
                        },
                        {
                            title: "Controle total",
                            description:
                                "Exclua jogos, veja detalhes e faça logout com apenas um clique.",
                        },
                    ].map((card) => (
                        <div
                            key={card.title}
                            className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl shadow-slate-950/20"
                        >
                            <h2 className="text-xl font-semibold text-white mb-3">
                                {card.title}
                            </h2>
                            <p className="text-slate-400 leading-7">
                                {card.description}
                            </p>
                        </div>
                    ))}
                </section>
            </div>
        </main>
    );
}
