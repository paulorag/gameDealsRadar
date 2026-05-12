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
                    <Button
                        type="submit"
                        disabled={loading || !authenticated}
                        variant="primary"
                        className="w-full"
                    >
                        {loading ? "Adicionando..." : "Rastrear Jogo"}
                    </Button>
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
