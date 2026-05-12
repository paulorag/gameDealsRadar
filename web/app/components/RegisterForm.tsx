"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, setToken } from "../lib/api";
import { useNotification } from "../hooks/useNotification";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { success, error } = useNotification();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${getApiUrl()}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                error(
                    "Erro ao cadastrar",
                    data?.message || "Falha ao cadastrar usuário.",
                );
                return;
            }

            const data = await response.json();
            setToken(data.token);
            success(
                "Conta criada!",
                "Bem-vindo! Você foi cadastrado com sucesso.",
            );
            router.push("/dashboard");
        } catch {
            error("Falha na conexão", "Não foi possível conectar ao servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleRegister}
            className="w-full max-w-xl mx-auto mb-6 p-6 rounded-3xl border border-slate-700 bg-slate-900 shadow-xl shadow-slate-950/30"
        >
            <h2 className="text-lg font-bold text-white mb-4">Cadastro</h2>
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
                    className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-3 rounded transition-colors disabled:opacity-50"
                >
                    {loading ? "Cadastrando..." : "Criar conta"}
                </button>
                <p className="text-slate-400 text-sm">
                    Já tem conta?{" "}
                    <Link
                        href="/login"
                        className="text-emerald-300 hover:text-emerald-200"
                    >
                        Faça login
                    </Link>
                </p>
            </div>
        </form>
    );
}
