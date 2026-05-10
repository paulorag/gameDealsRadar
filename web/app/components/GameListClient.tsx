"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getApiUrl, getApiHeaders } from "../lib/api";

interface GameDto {
    id: string;
    steamAppId: string;
    title: string;
    imageUrl?: string;
}

export default function GameListClient({ token }: { token: string | null }) {
    const [games, setGames] = useState<GameDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                console.log("🔍 Debug: Tentando buscar jogos");
                console.log("🔍 Debug: Token presente:", !!token);
                console.log("🔍 Debug: API URL:", getApiUrl());
                console.log("🔍 Debug: Headers:", getApiHeaders());

                const response = await fetch(`${getApiUrl()}/games`, {
                    cache: "no-store",
                    headers: getApiHeaders(),
                });

                console.log("🔍 Debug: Response status:", response.status);
                console.log("🔍 Debug: Response headers:", Object.fromEntries(response.headers.entries()));

                if (!response.ok) {
                    const responseText = await response.text();
                    console.log("🔍 Debug: Response body:", responseText);

                    if (response.status === 401) {
                        setError("Não autorizado. Faça login novamente.");
                    } else {
                        setError(`Falha ao buscar jogos. Status: ${response.status}`);
                    }
                    return;
                }

                const data = await response.json();
                console.log("🔍 Debug: Dados recebidos:", data);
                setGames(data);
            } catch (error) {
                console.error("🔍 Debug: Erro na requisição:", error);
                setError("Erro ao conectar com o backend.");
            } finally {
                setLoading(false);
            }
        }

        loadGames();
    }, [token]);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
            {games.map((game) => (
                <div
                    key={game.id}
                    className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-lg hover:shadow-emerald-500/20 transition-all"
                >
                    {game.imageUrl ? (
                        <div className="relative w-full h-48 rounded mb-4 overflow-hidden">
                            <Image
                                src={game.imageUrl}
                                alt={game.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-slate-700 rounded mb-4 flex items-center justify-center text-slate-500">
                            Sem Imagem
                        </div>
                    )}

                    <h2
                        className="text-xl font-bold text-white mb-2 truncate"
                        title={game.title}
                    >
                        {game.title}
                    </h2>

                    <div className="flex justify-between items-end mt-4">
                        <span className="text-sm text-slate-400">
                            ID Steam: {game.steamAppId}
                        </span>
                        <Link
                            href={`/game/${game.id}`}
                            className="text-emerald-400 font-bold border border-emerald-400 px-3 py-1 rounded hover:bg-emerald-400/10 transition-colors"
                        >
                            Ver Detalhes
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
}
