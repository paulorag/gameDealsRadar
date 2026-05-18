"use client";

import { useEffect } from "react";
import GameHistoryClient from "./GameHistoryClient";
import { useAuthStatus } from "../../hooks/useAuthStatus";

export default function GameDetailsClient({ id }: { id: string }) {
    const { checked } = useAuthStatus();

    useEffect(() => {
        if (!checked) return;

        // Não faz redirecionamento automático, apenas garante
        // que o estado de autenticação já foi carregado antes de renderizar.
    }, [checked]);

    if (!checked) {
        return null;
    }

    return (
        <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-500">
                Detalhes do Monitoramento
            </h1>

            <GameHistoryClient id={id} />
        </main>
    );
}
