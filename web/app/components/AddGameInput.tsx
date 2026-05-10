"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, getApiHeaders } from "../lib/api";

export default function AddGameInput() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setAuthenticated(Boolean(getToken()));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !authenticated) return;

        setLoading(true);

        const apiUrl = getApiUrl();

        try {
            const res = await fetch(`${getApiUrl()}/games`, {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                setUrl("");
                router.refresh();
            } else if (res.status === 401) {
                alert(
                    "Não autorizado. Verifique as credenciais Basic Auth configuradas.",
                );
            } else {
                alert(
                    "Erro ao adicionar jogo. Verifique o link e as configurações do backend.",
                );
            }
        } catch (error) {
            console.error("Erro de conexão:", error);
            alert("Falha ao conectar com o servidor.");
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
            <div className="flex flex-col gap-2 sm:flex-row">
                <button
                    type="submit"
                    disabled={loading || !authenticated}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Adicionando..." : "Rastrear"}
                </button>
                {!authenticated && (
                    <p className="text-yellow-300 text-sm mt-2 sm:mt-0">
                        Faça login para adicionar um jogo.
                    </p>
                )}
            </div>
        </form>
    );
}
