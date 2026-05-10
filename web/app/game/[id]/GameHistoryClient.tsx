"use client";

import { useEffect, useState } from "react";
import PriceChart from "../../components/PriceChart";
import { getApiUrl, getApiHeaders, getToken } from "../../lib/api";

export default function GameHistoryClient({ id }: { id: string }) {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(getToken());
    }, []);

    useEffect(() => {
        async function loadHistory() {
            setLoading(true);
            setError(null);

            if (!token) {
                setError("Faça login para visualizar o histórico de preços.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${getApiUrl()}/games/${id}/history`,
                    {
                        cache: "no-store",
                        headers: getApiHeaders(),
                    },
                );

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Não autorizado. Faça login novamente.");
                    } else {
                        setError("Falha ao carregar histórico.");
                    }
                    return;
                }

                const data = await response.json();
                setHistory(data);
            } catch (err) {
                setError("Erro ao conectar com o backend.");
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, [id, token]);

    if (loading) {
        return (
            <p className="text-yellow-400 animate-pulse">
                Carregando histórico...
            </p>
        );
    }

    if (error) {
        return <p className="text-red-400">{error}</p>;
    }

    if (history.length === 0) {
        return (
            <p className="text-slate-500">Nenhum histórico disponível ainda.</p>
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
                            <tr key={item.id} className="hover:bg-slate-700/50">
                                <td className="px-6 py-4">
                                    {new Date(item.checkDate).toLocaleString(
                                        "pt-BR",
                                        {
                                            timeZone: "America/Sao_Paulo",
                                        },
                                    )}
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
}
