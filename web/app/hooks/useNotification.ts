"use client";

import { useNotificationContext } from "../context/NotificationContext";

export function useNotification() {
    const { addNotification } = useNotificationContext();

    return {
        success: (title: string, message: string): string => {
            return addNotification({ type: "success", title, message });
        },
        error: (title: string, message: string): string => {
            return addNotification({ type: "error", title, message });
        },
        warning: (title: string, message: string): string => {
            return addNotification({ type: "warning", title, message });
        },
        info: (title: string, message: string, duration?: number): string => {
            return addNotification({ type: "info", title, message, duration });
        },
    };
}
