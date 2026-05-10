import SecureDashboard from "../components/SecureDashboard";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Painel de Rastreamento
                    </h1>
                    <p className="mt-2 text-slate-300">
                        Adicione jogos, visualize sua lista e acompanhe
                        histórico de preços.
                    </p>
                </header>
                <SecureDashboard />
            </div>
        </main>
    );
}
