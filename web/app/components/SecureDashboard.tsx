"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AddGameInput from "./AddGameInput";
import Button from "./Button";
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
            <div className="w-full max-w-3xl mx-auto p-8 rounded-3xl border border-slate-700 bg-slate-900 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                    Acesso restrito
                </h2>
                <p className="text-slate-300 mb-6">
                    Você precisa fazer login ou cadastrar-se para acessar o
                    painel de rastreamento.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/login" className="flex-1">
                        <Button
                            type="button"
                            variant="primary"
                            className="w-full rounded-full"
                        >
                            Login
                        </Button>
                    </Link>
                    <Link href="/signup" className="flex-1">
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full rounded-full"
                        >
                            Cadastrar
                        </Button>
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
                        <Button
                            type="button"
                            variant="danger"
                            onClick={handleLogout}
                            className="px-5 py-3 text-sm"
                        >
                            Logout
                        </Button>
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
