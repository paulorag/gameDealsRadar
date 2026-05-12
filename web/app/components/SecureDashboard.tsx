"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddGameInput from "./AddGameInput";
import GameListClient from "./GameListClient";
import { getToken, removeToken } from "../lib/api";

export default function SecureDashboard() {
    const [token, setToken] = useState<string | null>(() => getToken());
    const [reloadSignal, setReloadSignal] = useState(0);
    const router = useRouter();

    const handleLogout = () => {
        removeToken();
        setToken(null);
        router.push("/login");
    };

    if (!token) {
        return (
            <div className="w-full max-w-3xl p-8 rounded-3xl border border-slate-700 bg-slate-900 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Acesso restrito
                </h2>
                <p className="text-slate-300 mb-6">
                    Você precisa fazer login ou cadastrar-se para acessar o
                    painel de rastreamento.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link
                        href="/login"
                        className="px-6 py-3 rounded-full bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="px-6 py-3 rounded-full border border-slate-700 text-white hover:border-emerald-400 hover:text-emerald-400 transition"
                    >
                        Cadastrar
                    </Link>
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
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="cursor-pointer rounded-lg border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 hover:border-red-500/50 transition duration-200 shadow-lg shadow-red-500/10 hover:shadow-red-500/20"
                        >
                            Logout
                        </button>
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
