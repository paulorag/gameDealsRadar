"use client";

import { useEffect, useState } from "react";
import { getToken } from "../lib/api";

export function useAuthStatus() {
    const [authenticated, setAuthenticated] = useState<boolean>(false);
    const [checked, setChecked] = useState<boolean>(false);

    useEffect(() => {
        const token = getToken();
        setAuthenticated(Boolean(token));
        setChecked(true);
    }, []);

    return { authenticated, checked };
}
