"use client";

import { useState, useEffect } from "react";
import { getApiUrl } from "../lib/api";
import Image from "next/image";
import Link from "next/link";

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
                <h2 className="text-2xl font-bold text-white mb-6">Jogos Mais Adicionados 🔥</h2>
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
                <h2 className="text-2xl font-bold text-white">Jogos Mais Adicionados 🔥</h2>
                <Link
                    href="/login"
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition"
                >
                    Faça login para adicionar →
                </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 overflow-hidden transition hover:border-slate-600"
                    >
                        <div className="relative aspect-video overflow-hidden bg-slate-900">
                            {game.imageUrl ? (
                                <Image
                                    src={game.imageUrl}
                                    alt={game.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400">
                                    Sem imagem
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-emerald-500/90 text-white px-2 py-1 rounded-lg text-xs font-semibold">
                                {game.userCount} {game.userCount === 1 ? "usuário" : "usuários"}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-semibold text-white line-clamp-2 text-sm mb-2">
                                {game.title}
                            </h3>

                            <a
                                href={game.urlLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full rounded-lg bg-slate-700/50 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-600"
                            >
                                Ver no Steam ↗
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
