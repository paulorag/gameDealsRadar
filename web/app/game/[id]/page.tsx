import { Suspense } from "react";
import PriceChart from "../../components/PriceChart";

async function GameHistory({ id }: { id: string }) {
    try {
        const res = await fetch(`http://localhost:8080/games/${id}/history`, {
            cache: "no-store",
        });
        const history = await res.json();

        if (!history || history.length === 0) {
            return (
                <p className="text-slate-500">
                    Nenhum histórico disponível ainda.
                </p>
            );
        }

        return (
            <div className="w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Histórico de Preços
                </h2>
                <PriceChart data={history} />
                <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                    <table className="w-full text-left text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Preço (R$)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {history.map((item: any) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-700/50"
                                >
                                    <td className="px-6 py-4">
                                        {new Date(
                                            item.checkDate
                                        ).toLocaleString("pt-BR")}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-emerald-400">
                                        R$ {item.price.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    } catch (error) {
        return <p className="text-red-400">Erro ao carregar histórico.</p>;
    }
}

export default async function GameDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Detalhes do Monitoramento
            </h1>

            <a
                href="/"
                className="mb-8 text-slate-400 hover:text-white transition-colors"
            >
                ← Voltar para Home
            </a>

            <Suspense fallback={<p>Carregando dados...</p>}>
                {/* Agora passamos o ID correto */}
                <GameHistory id={id} />
            </Suspense>
        </main>
    );
}
