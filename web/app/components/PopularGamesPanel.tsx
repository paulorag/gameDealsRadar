"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../lib/api";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { useAuthStatus } from "../hooks/useAuthStatus";

interface PopularGame {
    id: string;
    steamAppId: string;
    title: string;
    urlLink: string;
    imageUrl: string;
    targetPrice?: number;
    userCount: number;
}

export default function PopularGamesPanel() {
    const { authenticated } = useAuthStatus();
    const [games, setGames] = useState<PopularGame[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPopularGames = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${getApiUrl()}/games/popular`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar jogos populares");
                }

                const data = await response.json();
                setGames(data.slice(0, 6)); // Mostrar apenas 6 primeiros
                setError(null);
            } catch (err) {
                console.error("Erro ao carregar jogos populares:", err);
                setError("Erro ao carregar jogos populares");
                setGames([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularGames();
    }, []);

    if (loading) {
        return (
            <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
                <h2 className="text-2xl font-bold text-white mb-6">
                    Jogos Mais Adicionados 🔥
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="rounded-2xl bg-slate-800/50 h-64 animate-pulse"
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (error || games.length === 0) {
        return null;
    }

    return (
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/30">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Jogos Mais Adicionados 🔥
                </h2>
                {authenticated && (
                    <Link
                        href="/dashboard"
                        className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
                    >
                        Vá para seu painel →
                    </Link>
                )}
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="group relative flex h-full flex-col justify-between rounded-3xl border border-slate-700 bg-linear-to-br from-slate-800 to-slate-900 p-4 shadow-lg shadow-slate-950/30 transition duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                    >
                        {game.imageUrl ? (
                            <div className="relative w-full h-48 rounded-2xl mb-4 overflow-hidden border border-slate-600 group-hover:border-emerald-500/30 transition">
                                <Image
                                    src={game.imageUrl}
                                    alt={game.title}
                                    fill
                                    className="object-cover object-center group-hover:scale-105 transition duration-300"
                                />
                                <a
                                    href={game.urlLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Ver na Steam"
                                    aria-label="Ver na Steam"
                                    className="absolute top-3 right-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/90 ring-1 ring-slate-800/40 transition"
                                >
                                    <Image
                                        src="/assets/steam_logo.png"
                                        alt="Steam"
                                        width={28}
                                        height={28}
                                        className="h-7 w-7"
                                    />
                                </a>
                            </div>
                        ) : (
                            <div className="relative w-full h-48 bg-linear-to-br from-slate-700 to-slate-800 rounded-2xl mb-4 flex items-center justify-center text-slate-400 border border-slate-600">
                                Sem imagem
                            </div>
                        )}

                        <h2
                            className="text-base font-bold text-white mb-3 truncate leading-tight group-hover:text-emerald-300 transition"
                            title={game.title}
                        >
                            {game.title}
                        </h2>

                        <div className="flex flex-col gap-4 mt-auto pt-3 border-t border-slate-700/50">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                                    ID Steam:
                                </span>
                                <span className="text-xs font-mono text-emerald-400">
                                    {game.steamAppId}
                                </span>
                            </div>

                            <div className="flex gap-2 pt-1">
                                <Link
                                    href={`/game/${game.id}`}
                                    className="flex-1"
                                >
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="w-full text-xs py-2 px-0"
                                    >
                                        Histórico de Preços
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
