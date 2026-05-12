import { useState, useCallback } from "react";
import {
    NotificationMessage,
    NotificationType,
} from "../components/Notification";

export function useNotification() {
    const [notifications, setNotifications] = useState<NotificationMessage[]>(
        [],
    );

    const addNotification = useCallback(
        (
            type: NotificationType,
            title: string,
            message?: string,
            durationMs = 5000,
        ) => {
            const id = `${Date.now()}-${Math.random()}`;
            const notification: NotificationMessage = {
                id,
                type,
                title,
                message,
            };

            setNotifications((prev) => [...prev, notification]);

            if (durationMs > 0) {
                const timer = setTimeout(() => {
                    removeNotification(id);
                }, durationMs);

                return () => clearTimeout(timer);
            }
        },
        [],
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const success = useCallback(
        (title: string, message?: string) =>
            addNotification("success", title, message),
        [addNotification],
    );

    const error = useCallback(
        (title: string, message?: string) =>
            addNotification("error", title, message),
        [addNotification],
    );

    const warning = useCallback(
        (title: string, message?: string) =>
            addNotification("warning", title, message),
        [addNotification],
    );

    const info = useCallback(
        (title: string, message?: string) =>
            addNotification("info", title, message),
        [addNotification],
    );

    return {
        notifications,
        removeNotification,
        success,
        error,
        warning,
        info,
    };
}
