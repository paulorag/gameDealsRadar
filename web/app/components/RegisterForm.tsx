"use client";

import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl, setToken } from "../lib/api";
import Button from "./Button";
import { useNotification } from "../hooks/useNotification";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { success, error } = useNotification();

    const passwordCriteria = useMemo(() => ({
        hasMinLength: password.length >= 8,
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /[0-9]/.test(password),
        hasSpecialChar: /[^A-Za-z0-9]/.test(password),
    }), [password]);

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
    const passwordsMatch = password !== "" && password === confirmPassword;
    const canSubmit =
        Boolean(username.trim()) &&
        isPasswordValid &&
        passwordsMatch &&
        !loading;

    const handleRegister = async (event: FormEvent) => {
        event.preventDefault();

        if (!isPasswordValid || !passwordsMatch) {
            error(
                "Senha inválida",
                "Verifique os critérios de segurança e a confirmação da senha.",
            );
            return;
        }

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
                <div className="rounded-2xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
                    <p className="mb-3 font-semibold text-slate-100">
                        Requisitos de senha
                    </p>
                    <ul className="grid gap-2">
                        <li className="flex items-center gap-2">
                            <span className={passwordCriteria.hasMinLength ? "text-emerald-400" : "text-slate-500"}>
                                {passwordCriteria.hasMinLength ? "✅" : "❌"}
                            </span>
                            <span className={passwordCriteria.hasMinLength ? "text-slate-100" : "text-slate-500"}>
                                Mínimo de 8 caracteres
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={passwordCriteria.hasUpperCase ? "text-emerald-400" : "text-slate-500"}>
                                {passwordCriteria.hasUpperCase ? "✅" : "❌"}
                            </span>
                            <span className={passwordCriteria.hasUpperCase ? "text-slate-100" : "text-slate-500"}>
                                Pelo menos uma letra maiúscula
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={passwordCriteria.hasLowerCase ? "text-emerald-400" : "text-slate-500"}>
                                {passwordCriteria.hasLowerCase ? "✅" : "❌"}
                            </span>
                            <span className={passwordCriteria.hasLowerCase ? "text-slate-100" : "text-slate-500"}>
                                Pelo menos uma letra minúscula
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={passwordCriteria.hasNumber ? "text-emerald-400" : "text-slate-500"}>
                                {passwordCriteria.hasNumber ? "✅" : "❌"}
                            </span>
                            <span className={passwordCriteria.hasNumber ? "text-slate-100" : "text-slate-500"}>
                                Pelo menos um número
                            </span>
                        </li>
                        <li className="flex items-center gap-2">
                            <span className={passwordCriteria.hasSpecialChar ? "text-emerald-400" : "text-slate-500"}>
                                {passwordCriteria.hasSpecialChar ? "✅" : "❌"}
                            </span>
                            <span className={passwordCriteria.hasSpecialChar ? "text-slate-100" : "text-slate-500"}>
                                Pelo menos um caractere especial
                            </span>
                        </li>
                    </ul>
                </div>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar Senha"
                    className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded focus:outline-none focus:border-emerald-500"
                />
                {confirmPassword.length > 0 && (
                    <p className={`text-sm ${passwordsMatch ? "text-emerald-400" : "text-rose-400"}`}>
                        {passwordsMatch ? "Senhas coincidem." : "As senhas não coincidem."}
                    </p>
                )}
                <Button
                    type="submit"
                    disabled={!canSubmit}
                    variant="primary"
                    className="w-full"
                >
                    {loading ? "Cadastrando..." : "Criar conta"}
                </Button>
                <div className="flex flex-col gap-2 text-center">
                    <p className="text-slate-400 text-sm">Já tem conta?</p>
                    <Link href="/login" className="mx-auto">
                        <Button type="button" variant="secondary">
                            Faça login
                        </Button>
                    </Link>
                </div>
            </div>
        </form>
    );
}
