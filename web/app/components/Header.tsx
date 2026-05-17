"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, removeToken } from "../lib/api";
import Button from "./Button";

export default function Header() {
    const getUsernameFromToken = (token: string | null) => {
        if (!token) return null;
        try {
            const parts = token.split(".");
            if (parts.length < 2) return null;
            const payload = parts[1];
            const decoded = JSON.parse(
                atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
            );
            return (
                decoded?.preferred_username ||
                decoded?.username ||
                decoded?.sub ||
                null
            );
        } catch {
            return null;
        }
    };

    const token = getToken();
    const [authenticated, setAuthenticated] = useState<boolean>(Boolean(token));
    const [username, setUsername] = useState<string | null>(() =>
        getUsernameFromToken(token),
    );
    const router = useRouter();

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "gameDealsRadarAuthToken") {
                const newToken = event.newValue;
                setAuthenticated(Boolean(newToken));
                setUsername(getUsernameFromToken(newToken));
            }
        };

        const handleAuthChange = () => {
            const newToken = getToken();
            setAuthenticated(Boolean(newToken));
            setUsername(getUsernameFromToken(newToken));
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("authChange", handleAuthChange);
        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        removeToken();
        setAuthenticated(false);
        setUsername(null);
        router.push("/");
    };

    return (
        <header className="fixed inset-x-0 top-0 z-20 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-black/20 shadow-sm">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8">
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-3 px-1 py-0 transition"
                        title="Home"
                        aria-label="Home do Game Deals Radar"
                    >
                        <Image
                            src="/logo-radar.svg"
                            alt="Game Deals Radar logo"
                            width={36}
                            height={36}
                            className="h-9 w-9 shrink-0 object-contain"
                        />
                        <span className="text-lg font-semibold tracking-tight text-slate-100">
                            Game Deals Radar
                        </span>
                    </Link>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {authenticated ? (
                        <>
                            <span className="px-3 py-2 text-sm font-medium text-emerald-300">
                                {username ?? "Teste"}
                            </span>
                            <Link href="/dashboard">
                                <Button
                                    type="button"
                                    variant="primary"
                                    className="px-4 py-2"
                                >
                                    Ver painel
                                </Button>
                            </Link>
                            <Button
                                type="button"
                                variant="secondary"
                                className="px-4 py-2"
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button type="button" variant="primary">
                                    Entrar
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button type="button" variant="ghost">
                                    Cadastrar
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
