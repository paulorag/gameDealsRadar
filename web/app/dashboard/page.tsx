import SecureDashboard from "../components/SecureDashboard";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-slate-950 p-8">
            <div className="mx-auto w-full max-w-6xl">
                <header className="mb-10 text-center">
                    <p className="text-sm uppercase tracking-[0.35em] text-emerald-400/80">
                        Dashboard
                    </p>
                    <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Seu radar de ofertas Steam
                    </h1>
                    <p className="mt-4 text-slate-400 max-w-3xl mx-auto leading-7">
                        Adicione jogos, acompanhe o histórico de preços e
                        mantenha seu portfólio de ofertas sempre sob controle.
                    </p>
                </header>
                <SecureDashboard />
            </div>
        </main>
    );
}
