"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, getToken, removeToken, setToken } from "../lib/api";
import { useNotification } from "../hooks/useNotification";

export default function LoginForm({
    onAuthChange,
}: {
    onAuthChange?: () => void;
}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [token, setLocalToken] = useState<string | null>(null);
    const router = useRouter();
    const { success, error } = useNotification();

    useEffect(() => {
        setLocalToken(getToken());
    }, []);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${getApiUrl()}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const message =
                    response.status === 401
                        ? "Credenciais inválidas."
                        : "Falha ao autenticar.";
                error("Erro ao fazer login", message);
                return;
            }

            const data = await response.json();
            setToken(data.token);
            setLocalToken(data.token);
            setUsername("");
            setPassword("");
            success("Bem-vindo!", "Você foi autenticado com sucesso.");
            onAuthChange?.();
            router.push("/dashboard");
        } catch {
            error("Falha na conexão", "Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        removeToken();
        setLocalToken(null);
        onAuthChange?.();
    };

    if (token) {
        return (
            <div className="w-full max-w-xl mb-6 p-4 rounded-lg border border-emerald-500 bg-slate-900">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-slate-200">Já está autenticado.</p>
                    <div className="flex gap-3">
                        <Link
                            href="/dashboard"
                            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-semibold px-4 py-2 rounded"
                        >
                            Abrir painel
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleLogin}
            className="w-full max-w-xl mx-auto mb-6 p-6 rounded-3xl border border-slate-700 bg-slate-900 shadow-xl shadow-slate-950/30"
        >
            <h2 className="text-lg font-bold text-white mb-4">Login</h2>
            <div className="grid gap-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Usuário"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-emerald-500"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-emerald-500"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "Conectando..." : "Entrar"}
                </button>
                <p className="text-slate-400 text-sm">
                    Não tem conta?{" "}
                    <Link
                        href="/signup"
                        className="text-emerald-300 hover:text-emerald-200"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </form>
    );
}
