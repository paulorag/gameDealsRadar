"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, getApiHeaders } from "../lib/api";

export default function AddGameInput({
    authenticated,
    onGameAdded,
}: {
    authenticated: boolean;
    onGameAdded?: () => void;
}) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !authenticated) return;

        setLoading(true);

        const apiUrl = getApiUrl();

        try {
            console.log("🔍 Debug: Enviando POST para", `${apiUrl}/games`);
            console.log("🔍 Debug: Headers:", getApiHeaders());
            console.log("🔍 Debug: Payload:", { url });

            const res = await fetch(`${apiUrl}/games`, {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({ url }),
            });

            console.log("🔍 Debug: POST /games status", res.status);

            if (res.ok) {
                setUrl("");
                onGameAdded?.();
            } else {
                const body = await res.text();
                console.error("🔍 Debug: POST /games erro", res.status, body);

                if (res.status === 401) {
                    alert("Não autorizado. Faça login novamente.");
                } else if (res.status === 403) {
                    alert(
                        "Acesso negado. Verifique se você está autenticado corretamente.",
                    );
                } else {
                    alert(`Erro ao adicionar jogo (${res.status}). ${body}`);
                }
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert(
                `Falha ao conectar no servidor (${apiUrl}). Verifique se o backend está online.`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900/50 p-6 shadow-lg shadow-slate-950/20"
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                        Adicionar Novo Jogo
                    </label>
                    <input
                        type="url"
                        placeholder="https://store.steampowered.com/app/..."
                        className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading || !authenticated}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button
                        type="submit"
                        disabled={loading || !authenticated}
                        className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-bold px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
                    >
                        {loading ? "Adicionando..." : "Rastrear Jogo"}
                    </button>
                    {!authenticated && (
                        <p className="text-yellow-300 text-sm font-medium">
                            ✓ Faça login para adicionar jogos
                        </p>
                    )}
                </div>
            </div>
        </form>
    );
}
