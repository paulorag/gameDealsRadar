"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { getApiUrl } from "../lib/api";
import { useNotificationContext } from "./NotificationContext";

interface ServerContextType {
    isWakingUp: boolean;
}

const ServerContext = createContext<ServerContextType>({ isWakingUp: false });

export function ServerProvider({ children }: { children: React.ReactNode }) {
    const [isWakingUp, setIsWakingUp] = useState(false);
    const { addNotification, removeNotification } = useNotificationContext();
    const notificationShownRef = useRef(false);
    const notificationIdRef = useRef<string | null>(null);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        let pollIntervallId: NodeJS.Timeout;

        const checkServerHealth = async (): Promise<boolean> => {
            try {
                const response = await fetch(`${getApiUrl()}/games/popular`, {
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

                // Show notification only once per session (persists until server is up)
                if (!notificationShownRef.current) {
                    notificationShownRef.current = true;
                    // No duration limit - notification persists until server responds
                    const notifId = addNotification({
                        type: "info",
                        title: "Servidor acordando ☕",
                        message:
                            "Estamos ligando os motores. Como o servidor é gratuito, o primeiro acesso leva de 30 a 120 segundos. Aguarde...",
                    });
                    notificationIdRef.current = notifId;
                }

                pollIntervallId = setInterval(async () => {
                    const isHealthy = await checkServerHealth();
                    if (isHealthy) {
                        clearInterval(pollIntervallId);
                        setIsWakingUp(false);
                        notificationShownRef.current = false;

                        // Remove the wake-up notification when server is back
                        if (notificationIdRef.current) {
                            removeNotification(notificationIdRef.current);
                            notificationIdRef.current = null;
                        }

                        // Show success notification
                        addNotification({
                            type: "success",
                            title: "Servidor online! ✓",
                            message:
                                "Tudo pronto. A aplicação está funcionando normalmente.",
                            duration: 3000,
                        });
                    }
                }, 3000);
            }, 6000);
        };

        wakeUpServer();

        return () => {
            clearTimeout(timeoutId);
            if (pollIntervallId) clearInterval(pollIntervallId);
        };
    }, [addNotification, removeNotification]);

    return (
        <ServerContext.Provider value={{ isWakingUp }}>
            {children}
        </ServerContext.Provider>
    );
}

export const useServerStatus = () => useContext(ServerContext);
