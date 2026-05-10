const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_USER = process.env.NEXT_PUBLIC_API_USER;
const API_PASSWORD = process.env.NEXT_PUBLIC_API_PASSWORD;

function encodeCredentials(value: string) {
    if (typeof window === "undefined") {
        return Buffer.from(value).toString("base64");
    }

    return btoa(value);
}

export function getApiUrl() {
    return API_URL;
}

export function getAuthHeader() {
    if (!API_USER || !API_PASSWORD) {
        return undefined;
    }

    return `Basic ${encodeCredentials(`${API_USER}:${API_PASSWORD}`)}`;
}

export function getApiHeaders(contentType = "application/json") {
    const headers: Record<string, string> = {
        "Content-Type": contentType,
    };

    const authHeader = getAuthHeader();
    if (authHeader) {
        headers["Authorization"] = authHeader;
    }

    return headers;
}
