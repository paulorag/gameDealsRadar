"use client";

import { useEffect, useState } from "react";
import { getToken } from "../lib/api";

export function useAuthStatus() {
    const token = getToken();
    const [authenticated, setAuthenticated] = useState<boolean>(Boolean(token));

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === "gameDealsRadarAuthToken") {
                setAuthenticated(Boolean(event.newValue));
            }
        };

        const handleAuthChange = () => {
            setAuthenticated(Boolean(getToken()));
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("authChange", handleAuthChange);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, []);

    return { authenticated, checked: true };
}
