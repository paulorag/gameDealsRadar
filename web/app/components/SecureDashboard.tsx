"use client";

import { useState } from "react";
import AddGameInput from "./AddGameInput";
import GameListClient from "./GameListClient";
import { getToken } from "../lib/api";

export default function SecureDashboard() {
    const [token, setToken] = useState<string | null>(() => getToken());
    const [reloadSignal, setReloadSignal] = useState(0);

    if (!token) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-full max-w-md p-10 rounded-3xl border border-slate-700 bg-slate-900/80 text-center">
                    <div className="flex items-center justify-center mb-6">
                        <div className="relative inline-flex">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="h-20 w-20 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >
                                <rect
                                    x="6"
                                    y="10"
                                    width="12"
                                    height="9"
                                    rx="2"
                                />
                                <path d="M9 10V8a3 3 0 0 1 6 0v2" />
                            </svg>
                            <span className="absolute -top-2 -right-2 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                !
                            </span>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-4">
                        Acesso Restrito
                    </h2>
                    <p className="text-slate-300">
                        Faça login ou cadastre-se para acessar o painel.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center gap-10">
            <section className="w-full max-w-7xl rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/90 to-slate-950/50 p-8 shadow-2xl shadow-slate-950/50 backdrop-blur-xl hover:border-slate-600/50 transition duration-300">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                        <p className="text-xs uppercase tracking-[0.4em] text-emerald-400/70 font-semibold">
                            Dashboard
                        </p>
                        <h2 className="mt-3 text-4xl font-bold text-white">
                            Seus Jogos Monitorados
                        </h2>
                        <p className="mt-3 max-w-2xl text-slate-300 leading-relaxed">
                            Adicione jogos da Steam, acompanhe o histórico de
                            preços e mantenha seu radar sempre atualizado.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                        {/* Logout is handled by the global Header */}
                    </div>
                </div>
            </section>
            <div className="w-full max-w-7xl">
                <AddGameInput
                    authenticated={Boolean(token)}
                    onGameAdded={() => setReloadSignal((prev) => prev + 1)}
                />
            </div>
            <div className="w-full max-w-7xl">
                <GameListClient
                    token={token}
                    reloadSignal={reloadSignal}
                    onGameDeleted={() => setReloadSignal((prev) => prev + 1)}
                />
            </div>
        </div>
    );
}
