"use client";

import Notification, { NotificationMessage } from "./Notification";
import { useNotificationContext } from "../context/NotificationContext";

export default function NotificationContainer() {
    const { notifications, removeNotification } = useNotificationContext();

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto">
                    <Notification
                        notification={notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                </div>
            ))}
        </div>
    );
}
