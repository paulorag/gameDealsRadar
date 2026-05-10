"use client";

import Link from "next/link";
import { useState } from "react";
import AddGameInput from "./AddGameInput";
import GameListClient from "./GameListClient";
import { getToken } from "../lib/api";

export default function SecureDashboard() {
    const [token] = useState<string | null>(() => getToken());
    const [reloadSignal, setReloadSignal] = useState(0);

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
        <div className="w-full flex flex-col items-center gap-6">
            <AddGameInput authenticated={Boolean(token)} onGameAdded={() => setReloadSignal((prev) => prev + 1)} />
            <GameListClient token={token} reloadSignal={reloadSignal} />
        </div>
    );
}
