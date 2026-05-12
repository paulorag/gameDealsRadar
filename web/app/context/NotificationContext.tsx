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

    const addNotification = useCallback(
        (notification: Omit<NotificationMessage, "id">) => {
            const id = Date.now().toString();
            setNotifications((prev) => [...prev, { ...notification, id }]);

            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                removeNotification(id);
            }, 5000);
        },
        [],
    );

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

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
