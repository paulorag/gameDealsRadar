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
        <div className="w-full flex flex-col items-center gap-8">
            <section className="w-full rounded-[32px] border border-slate-800 bg-slate-900/80 p-8 shadow-xl shadow-slate-950/40 backdrop-blur-xl">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-emerald-400/80">
                            Painel
                        </p>
                        <h2 className="mt-3 text-3xl font-bold text-white">
                            Seus jogos monitorados
                        </h2>
                        <p className="mt-2 max-w-2xl text-slate-400">
                            Adicione jogos da Steam, acompanhe o histórico de
                            preços e mantenha seu radar sempre atualizado.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-red-500 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-300 hover:bg-red-500/20 transition"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </section>
            <AddGameInput
                authenticated={Boolean(token)}
                onGameAdded={() => setReloadSignal((prev) => prev + 1)}
            />
            <GameListClient
                token={token}
                reloadSignal={reloadSignal}
                onGameDeleted={() => setReloadSignal((prev) => prev + 1)}
            />
        </div>
    );
}
