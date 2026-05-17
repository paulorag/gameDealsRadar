"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PriceChart from "../../components/PriceChart";
import { getApiUrl, getApiHeaders } from "../../lib/api";

interface PriceHistoryEntry {
    id: string;
    checkDate: string;
    price: number;
}

export default function GameHistoryClient({ id }: { id: string }) {
    const [history, setHistory] = useState<PriceHistoryEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<"6m" | "1y" | "max">("max");
    const router = useRouter();

    useEffect(() => {
        async function loadHistory() {
            setLoading(true);
            setError(null);

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
                        setError(
                            "Não autorizado. Faça login para visualizar o histórico.",
                        );
                    } else {
                        setError("Falha ao carregar histórico.");
                    }
                    return;
                }

                const data = await response.json();
                setHistory(data);
            } catch {
                setError("Erro ao conectar com o backend.");
            } finally {
                setLoading(false);
            }
        }

        loadHistory();
    }, [id]);

    const filteredHistory = useMemo(() => {
        if (filter === "max") {
            return history;
        }

        const months = filter === "6m" ? 6 : 12;
        const cutoff = new Date();
        cutoff.setMonth(cutoff.getMonth() - months);

        return history.filter((item) => new Date(item.checkDate) >= cutoff);
    }, [filter, history]);

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
            <div className="flex flex-col gap-4 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-white">
                        Histórico de Preços
                    </h2>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-emerald-400 hover:text-emerald-300"
                    >
                        <span className="text-base">←</span>
                        Voltar
                    </button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {(["6m", "1y", "max"] as const).map((option) => {
                        const label =
                            option === "6m"
                                ? "6m"
                                : option === "1y"
                                  ? "1y"
                                  : "max";
                        const active = filter === option;
                        return (
                            <button
                                key={option}
                                type="button"
                                onClick={() => setFilter(option)}
                                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${active ? "bg-emerald-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:bg-slate-800"}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {filteredHistory.length > 0 ? (
                <PriceChart data={filteredHistory} />
            ) : (
                <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-8 text-center text-slate-400">
                    Não há dados para esse período.
                </div>
            )}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                <div className="max-h-[420px] overflow-y-auto overflow-x-hidden">
                    <table className="w-full min-w-full text-left text-slate-300">
                        <thead className="bg-slate-900 text-slate-400 uppercase text-xs sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3">Preço (R$)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredHistory.map((item) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-slate-700/50"
                                >
                                    <td className="px-6 py-4">
                                        {new Date(
                                            item.checkDate,
                                        ).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                        })}
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
        </div>
    );
}
