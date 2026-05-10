const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const TOKEN_STORAGE_KEY = "gameDealsRadarAuthToken";

export function getApiUrl() {
    return API_URL;
}

export function getToken() {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setToken(token: string) {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function removeToken() {
    if (typeof window === "undefined") {
        return;
    }

    localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export function getApiHeaders(contentType = "application/json") {
    const headers: Record<string, string> = {
        "Content-Type": contentType,
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}
