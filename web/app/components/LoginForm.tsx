"use client";

import { useEffect, useState } from "react";
import { getApiUrl, getToken, removeToken, setToken } from "../lib/api";

export default function LoginForm({ onAuthChange }: { onAuthChange?: () => void }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [token, setLocalToken] = useState<string | null>(null);

    useEffect(() => {
        setLocalToken(getToken());
    }, []);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
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
                const message = response.status === 401
                    ? "Credenciais inválidas."
                    : "Falha ao autenticar.";
                setError(message);
                return;
            }

            const data = await response.json();
            setToken(data.token);
            setLocalToken(data.token);
            setUsername("");
            setPassword("");
            onAuthChange?.();
        } catch (err) {
            setError("Falha ao conectar com o servidor.");
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
                <div className="flex items-center justify-between gap-4">
                    <p className="text-slate-200">Autenticado com token JWT.</p>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                    >
                        Logout
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleLogin}
            className="w-full max-w-xl mb-6 p-4 rounded-lg border border-slate-700 bg-slate-900"
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
                {error && <p className="text-red-400">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "Conectando..." : "Entrar"}
                </button>
            </div>
        </form>
    );
}
