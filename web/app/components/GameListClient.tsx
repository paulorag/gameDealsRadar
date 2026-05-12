"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl, getApiHeaders } from "../lib/api";
import Button from "./Button";
import ConfirmDialog from "./ConfirmDialog";
import { useNotification } from "../hooks/useNotification";

interface GameDto {
    id: string;
    steamAppId: string;
    title: string;
    imageUrl?: string;
}

export default function GameListClient({
    token,
    reloadSignal,
    onGameDeleted,
}: {
    token: string | null;
    reloadSignal: number;
    onGameDeleted?: () => void;
}) {
    const [games, setGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [gameToDelete, setGameToDelete] = useState<GameDto | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const { success, error: notifyError } = useNotification();

    const handleConfirmDelete = async () => {
        if (!gameToDelete) return;

        setDeleteLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${getApiUrl()}/games/${gameToDelete.id}`,
                {
                    method: "DELETE",
                    headers: getApiHeaders(),
                },
            );

            if (!response.ok) {
                setError(`Falha ao remover jogo: ${response.status}`);
                return;
            }

            setGames((current) =>
                current.filter((item) => item.id !== gameToDelete.id),
            );
            success("Jogo removido", "Removido com sucesso do seu radar.");
            onGameDeleted?.();
            setGameToDelete(null);
        } catch {
            notifyError("Erro ao remover", "Não foi possível conectar ao backend.");
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        async function loadGames() {
            setLoading(true);
            setError(null);

            if (!token) {
                setError("Faça login para visualizar seus jogos.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${getApiUrl()}/games`, {
                    cache: "no-store",
                    headers: getApiHeaders(),
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        setError("Não autorizado. Faça login novamente.");
                    } else {
                        setError(
                            `Falha ao buscar jogos (${response.status}). Tente novamente.`,
                        );
                    }
                    return;
                }

                const data = await response.json();
                setGames(data);
            } catch {
                setError(
                    "Erro ao conectar com o backend. Verifique sua internet.",
                );
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, [token, reloadSignal]);

    if (loading) {
        return (
            <p className="text-yellow-400 animate-pulse">Carregando jogos...</p>
        );
    }

    if (error) {
        return (
            <div className="p-4 border border-red-500 bg-red-500/10 rounded text-red-200">
                {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl">
            {games.length === 0 ? (
                <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-10 text-slate-400 text-center">
                    Ainda não há jogos no seu radar. Adicione um link da Steam
                    para começar.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
                    {games.map((game) => (
                        <div
                            key={game.id}
                            className="group flex h-full flex-col justify-between rounded-3xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-5 shadow-lg shadow-slate-950/30 transition duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                        >
                            {game.imageUrl ? (
                                <div className="relative w-full h-56 rounded-2xl mb-4 overflow-hidden border border-slate-600 group-hover:border-emerald-500/30 transition">
                                    <Image
                                        src={game.imageUrl}
                                        alt={game.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition duration-300"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-56 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl mb-4 flex items-center justify-center text-slate-500 border border-slate-600">
                                    Sem Imagem
                                </div>
                            )}

                            <h2
                                className="text-lg font-bold text-white mb-3 truncate leading-tight group-hover:text-emerald-300 transition"
                                title={game.title}
                            >
                                {game.title}
                            </h2>

                            <div className="flex flex-col gap-4 mt-auto pt-3 border-t border-slate-700/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs uppercase tracking-wider text-slate-500">
                                        ID Steam:
                                    </span>
                                    <span className="text-sm font-mono text-emerald-400">
                                        {game.steamAppId}
                                    </span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Link
                                        href={`/game/${game.id}`}
                                        className="flex-1"
                                    >
                                        <Button
                                            type="button"
                                            variant="primary"
                                            className="w-full"
                                        >
                                            Detalhes
                                        </Button>
                                    </Link>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        className="flex-1"
                                        onClick={() => setGameToDelete(game)}
                                    >
                                        Excluir
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <ConfirmDialog
                open={Boolean(gameToDelete)}
                title="Excluir jogo"
                description={
                    gameToDelete
                        ? `Tem certeza que deseja remover ${gameToDelete.title} do seu radar? Essa ação não pode ser desfeita.`
                        : ""
                }
                confirmText="Excluir"
                cancelText="Cancelar"
                onConfirm={handleConfirmDelete}
                onCancel={() => setGameToDelete(null)}
                loading={deleteLoading}
            />
        </div>
    );
}
