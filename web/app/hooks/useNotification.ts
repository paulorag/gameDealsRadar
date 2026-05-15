"use client";

import { useNotificationContext } from "../context/NotificationContext";

export function useNotification() {
    const { addNotification } = useNotificationContext();

    return {
        success: (title: string, message: string) => {
            addNotification({ type: "success", title, message });
        },
        error: (title: string, message: string) => {
            addNotification({ type: "error", title, message });
        },
        warning: (title: string, message: string) => {
            addNotification({ type: "warning", title, message });
        },
        info: (title: string, message: string, duration?: number) => {
            addNotification({ type: "info", title, message, duration });
        },
    };
}
