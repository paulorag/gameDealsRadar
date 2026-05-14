import LoginForm from "../components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-8">
            <div className="w-full max-w-2xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="flex justify-start mb-6">
                        <Link
                            href="/"
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
                            Início
                        </Link>
                    </div>
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
                        Login
                    </h1>
                    <p className="mt-4 text-slate-300">
                        Acesse o painel com sua conta para começar a rastrear
                        jogos.
                    </p>
                </div>
                <div className="rounded-[32px] border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-slate-950/40">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
}
