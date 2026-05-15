"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getApiUrl } from "../lib/api";
import { useNotification } from "../hooks/useNotification";

interface ServerContextType {
    isWakingUp: boolean;
}

const ServerContext = createContext<ServerContextType>({ isWakingUp: false });

export function ServerProvider({ children }: { children: React.ReactNode }) {
    const [isWakingUp, setIsWakingUp] = useState(false);
    const { info } = useNotification();

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const wakeUpServer = async () => {
            const pingPromise = fetch(`${getApiUrl()}/games`, {
                method: "HEAD",
                cache: "no-store",
            }).catch(() => {});

            timeoutId = setTimeout(() => {
                setIsWakingUp(true);
                info(
                    "Servidor acordando ☕",
                    "Estamos ligando os motores. Como o servidor é gratuito, o primeiro acesso leva cerca de 50s. Aguarde um instante!",
                    50000,
                );
            }, 4000);

            await pingPromise;

            clearTimeout(timeoutId);
            setIsWakingUp(false);
        };

        wakeUpServer();

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <ServerContext.Provider value={{ isWakingUp }}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServerStatus = () => useContext(ServerContext);
