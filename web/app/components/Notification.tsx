"use client";

import { useEffect, useState } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationMessage {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
}

const notificationStyles = {
    success: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        text: "text-emerald-200",
        icon: "✓",
        iconColor: "text-emerald-400",
    },
    error: {
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        text: "text-red-200",
        icon: "✕",
        iconColor: "text-red-400",
    },
    warning: {
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        text: "text-yellow-200",
        icon: "⚠",
        iconColor: "text-yellow-400",
    },
    info: {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-200",
        icon: "ℹ",
        iconColor: "text-blue-400",
    },
};

export default function Notification({
    notification,
    onClose,
}: {
    notification: NotificationMessage;
    onClose: () => void;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const style = notificationStyles[notification.type];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`transform transition-all duration-300 ${
                isVisible
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
            }`}
        >
            <div
                className={`rounded-2xl border ${style.bg} ${style.border} p-4 shadow-lg shadow-slate-950/50 max-w-md`}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`flex-shrink-0 text-xl font-bold ${style.iconColor}`}
                    >
                        {style.icon}
                    </div>
                    <div className="flex-1">
                        <h3 className={`font-semibold ${style.text}`}>
                            {notification.title}
                        </h3>
                        {notification.message && (
                            <p
                                className={`mt-1 text-sm ${style.text} opacity-80`}
                            >
                                {notification.message}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setTimeout(onClose, 300);
                        }}
                        className={`flex-shrink-0 text-lg opacity-60 hover:opacity-100 transition ${style.text}`}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}
