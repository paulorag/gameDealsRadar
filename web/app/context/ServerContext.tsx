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
        let pollIntervallId: NodeJS.Timeout;
        let notificationShown = false;

        const checkServerHealth = async (): Promise<boolean> => {
            try {
                const response = await fetch(`${getApiUrl()}/games`, {
                    method: "GET",
                    cache: "no-store",
                    signal: AbortSignal.timeout(5000),
                });
                return response.ok;
            } catch {
                return false;
            }
        };

        const wakeUpServer = async () => {
            const initialCheck = await checkServerHealth();
            if (initialCheck) {
                setIsWakingUp(false);
                return;
            }

            timeoutId = setTimeout(() => {
                setIsWakingUp(true);
                notificationShown = true;
                info(
                    "Servidor acordando ☕",
                    "Estamos ligando os motores. Como o servidor é gratuito, o primeiro acesso leva de 30 a 120 segundos. Aguarde...",
                    120000,
                );

                pollIntervallId = setInterval(async () => {
                    const isHealthy = await checkServerHealth();
                    if (isHealthy) {
                        clearInterval(pollIntervallId);
                        setIsWakingUp(false);
                        info(
                            "Servidor online! ✓",
                            "Tudo pronto. A aplicação está funcionando normalmente.",
                            3000,
                        );
                    }
                }, 3000);
            }, 6000);
        };

        wakeUpServer();

        return () => {
            clearTimeout(timeoutId);
            if (pollIntervallId) clearInterval(pollIntervallId);
        };
    }, [info]);

    return (
        <ServerContext.Provider value={{ isWakingUp }}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServerStatus = () => useContext(ServerContext);
