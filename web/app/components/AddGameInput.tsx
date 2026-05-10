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
                    alert("Acesso negado. Verifique se você está autenticado corretamente.");
                } else {
                    alert(`Erro ao adicionar jogo (${res.status}). ${body}`);
                }
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert(`Falha ao conectar no servidor (${apiUrl}). Verifique se o backend está online.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-xl mb-8 flex flex-col gap-2"
        >
            <input
                type="url"
                placeholder="Cole o link da loja Steam aqui..."
                className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-emerald-500 transition-colors"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading || !authenticated}
            />
            <div className="flex flex-col gap-2 sm:flex-row items-center">
                <button
                    type="submit"
                    disabled={loading || !authenticated}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Adicionando..." : "Rastrear"}
                </button>
                {!authenticated && (
                    <p className="text-yellow-300 text-sm">
                        Faça login para adicionar um jogo.
                    </p>
                )}
            </div>
        </form>
    );
}
