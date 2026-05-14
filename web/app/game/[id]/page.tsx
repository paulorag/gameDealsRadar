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

            <div className="flex justify-start mb-6">
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-colors text-lg font-semibold"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform group-hover:-translate-x-1.5"
                    >
                        <path d="m12 19-7-7 7-7" />
                        <path d="M19 12H5" />
                    </svg>
                    Voltar para Dashboard
                </Link>
            </div>

            <GameHistoryClient id={id} />
        </main>
    );
}
