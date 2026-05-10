import Link from "next/link";
import GameHistoryClient from "./GameHistoryClient";

export default async function GameDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <main className="min-h-screen flex flex-col items-center bg-slate-950 text-white p-8">
            <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                Detalhes do Monitoramento
            </h1>

            <Link
                href="/dashboard"
                className="mb-8 text-slate-400 hover:text-white transition-colors"
            >
                ← Voltar para Dashboard
            </Link>

            <GameHistoryClient id={id} />
        </main>
    );
}
