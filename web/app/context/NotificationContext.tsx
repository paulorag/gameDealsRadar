"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

export interface NotificationMessage {
    id: string;
    type: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: NotificationMessage[];
    addNotification: (notification: Omit<NotificationMessage, "id">) => void;
    removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
    undefined,
);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationMessage[]>(
        [],
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback(
        (notification: Omit<NotificationMessage, "id">) => {
            const id = Date.now().toString();
            const duration = notification.duration || 5000;

            setNotifications((prev) => [...prev, { ...notification, id }]);

            setTimeout(() => {
                removeNotification(id);
            }, duration);
        },
        [removeNotification],
    );

    return (
        <NotificationContext.Provider
            value={{ notifications, addNotification, removeNotification }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotificationContext must be used within NotificationProvider",
        );
    }
    return context;
}
