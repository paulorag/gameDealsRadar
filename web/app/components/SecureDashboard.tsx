"use client";

import { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import AddGameInput from "./AddGameInput";
import GameListClient from "./GameListClient";
import { getToken } from "../lib/api";

export default function SecureDashboard() {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        setToken(getToken());
    }, []);

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <LoginForm onAuthChange={() => setToken(getToken())} />
            <AddGameInput />
            <GameListClient token={token} />
        </div>
    );
}
