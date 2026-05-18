"use client";

import { useState } from "react";
import { getApiUrl, getApiHeaders } from "../lib/api";
import Button from "./Button";
import { useNotification } from "../hooks/useNotification";

export default function AddGameInput({
    authenticated,
    onGameAdded,
}: {
    authenticated: boolean;
    onGameAdded?: () => void;
}) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const { success, error } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url || !authenticated) return;

        setLoading(true);

        const apiUrl = getApiUrl();

        try {
            const res = await fetch(`${apiUrl}/games`, {
                method: "POST",
                headers: getApiHeaders(),
                body: JSON.stringify({ url }),
            });

            if (res.ok) {
                setUrl("");
                success(
                    "Jogo adicionado!",
                    "O jogo foi adicionado ao seu radar.",
                );
                onGameAdded?.();
            } else {
                const statusMessages: Record<number, string> = {
                    401: "Não autorizado. Faça login novamente.",
                    403: "Acesso negado. Verifique sua autenticação.",
                    400: "URL inválida. Verifique o link da Steam.",
                    409: "Este jogo já está no seu radar.",
                    500: "Erro no servidor. Tente novamente mais tarde.",
                };

                error(
                    "Erro ao adicionar jogo",
                    statusMessages[res.status] ||
                        `Erro ${res.status}. Tente novamente.`,
                );
            }
        } catch {
            error(
                "Falha na conexão",
                `Não foi possível conectar ao servidor. Verifique sua internet.`,
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-7xl mx-auto rounded-4xl border border-slate-700/50 bg-slate-900/50 p-8 shadow-lg backdrop-blur-sm"
        >
            <div className="flex flex-col gap-6">
                <label className="text-xs font-bold text-emerald-400 uppercase tracking-[0.3em]">
                    Adicionar Novo Jogo
                </label>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <input
                            type="url"
                            placeholder="Cole aqui o link da Steam (ex: https://store.steampowered.com/app/...)"
                            className="w-full bg-slate-800/50 border border-slate-700 text-white pl-4 pr-4 py-4 rounded-2xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all placeholder:text-slate-500"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            disabled={loading || !authenticated}
                        />
                    </div>

                    {/* Botão alinhado ao lado no Desktop, abaixo no Mobile */}
                    <Button
                        type="submit"
                        disabled={loading || !authenticated}
                        variant="primary"
                        className="w-full md:w-auto md:px-10 py-4 h-full rounded-2xl whitespace-nowrap"
                    >
                        {loading ? "Adicionando..." : "Rastrear Jogo"}
                    </Button>
                </div>

                {!authenticated && (
                    <div className="flex items-center gap-2 text-yellow-400/80 text-sm bg-yellow-400/5 border border-yellow-400/20 w-fit px-4 py-2 rounded-lg">
                        <span className="animate-pulse">●</span>
                        Faça login para começar a rastrear novos preços
                    </div>
                )}
            </div>
        </form>
    );
}
